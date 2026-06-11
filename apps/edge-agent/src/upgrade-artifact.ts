import { createHash, verify as verifySignature } from 'node:crypto';
import { chmod, link, mkdir, open, unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { EdgeReleaseArtifactMetadata } from './client';

export type VerifiedUpgradeArtifact = {
  path: string;
  version: string;
  checksum: string;
  url: string;
};

export type DownloadAndVerifyUpgradeArtifactInput = {
  release: EdgeReleaseArtifactMetadata;
  stagingDir: string;
  trustedPublicKeyPem: string;
  fetchImpl?: typeof fetch;
};

export async function downloadAndVerifyUpgradeArtifact(
  input: DownloadAndVerifyUpgradeArtifactInput,
): Promise<VerifiedUpgradeArtifact> {
  const safeUrl = sanitizeArtifactUrl(input.release.url);
  const artifactUrl = parseHttpsArtifactUrl(input.release.url);
  if (!artifactUrl) {
    throw new Error(`Upgrade artifact URL must use HTTPS: ${safeUrl}`);
  }

  const fetchImpl = input.fetchImpl ?? globalThis.fetch;
  let response: Response;
  try {
    response = await fetchImpl(input.release.url, { redirect: 'manual' });
  } catch {
    throw new Error(`Failed to download upgrade artifact from ${safeUrl}`);
  }

  if (!response.ok) {
    if (response.status >= 300 && response.status < 400) {
      throw new Error(`Upgrade artifact redirect rejected for ${safeUrl}: HTTP ${response.status}`);
    }
    throw new Error(`Failed to download upgrade artifact from ${safeUrl}: HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const checksum = createHash('sha256').update(bytes).digest('hex');
  if (checksum.toLowerCase() !== input.release.checksum.toLowerCase()) {
    throw new Error('Upgrade artifact checksum verification failed');
  }

  if (input.release.signatureAlgorithm.toLowerCase() !== 'ed25519') {
    throw new Error(`Unsupported upgrade signature algorithm: ${input.release.signatureAlgorithm}`);
  }

  const signatureOk = verifySignature(
    null,
    Buffer.from(input.release.checksum, 'utf8'),
    input.trustedPublicKeyPem,
    Buffer.from(input.release.signature, 'base64'),
  );
  if (!signatureOk) {
    throw new Error('Upgrade artifact signature verification failed');
  }

  await mkdir(input.stagingDir, { recursive: true });
  const artifactPath = join(
    input.stagingDir,
    `${sanitizeFileSegment(input.release.version)}-${sanitizeFileSegment(
      basename(artifactUrl.pathname) || 'artifact.bin',
    )}`,
  );
  const tempPath = join(
    input.stagingDir,
    `.${sanitizeFileSegment(input.release.version)}-${process.pid}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.tmp`,
  );
  let fileHandle: Awaited<ReturnType<typeof open>>;
  try {
    fileHandle = await open(tempPath, 'wx', 0o600);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      throw new Error(`Temporary staged upgrade artifact already exists: ${tempPath}`);
    }
    throw error;
  }
  let shouldRemoveTemp = true;
  try {
    await fileHandle.writeFile(bytes);
    await fileHandle.close();
    await chmod(tempPath, 0o600);
    await link(tempPath, artifactPath);
    shouldRemoveTemp = false;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      throw new Error(`Staged upgrade artifact already exists: ${artifactPath}`);
    }
    throw error;
  } finally {
    await fileHandle.close().catch(() => undefined);
    if (shouldRemoveTemp) {
      await unlink(tempPath).catch(() => undefined);
    }
  }
  await unlink(tempPath).catch(() => undefined);

  return {
    path: artifactPath,
    version: input.release.version,
    checksum,
    url: safeUrl,
  };
}

export function sanitizeArtifactUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '[invalid-url]';
  }
}

function parseHttpsArtifactUrl(rawUrl: string): URL | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function sanitizeFileSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, '_');
}
