import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { EdgeReleaseArtifactMetadata } from './client';
import { downloadAndVerifyUpgradeArtifact, sanitizeArtifactUrl } from './upgrade-artifact';

const tempDirs: string[] = [];

function createTempDir(name: string) {
  return mkdtemp(join(tmpdir(), `edge-agent-upgrade-${name}-`));
}

function arrayBufferFrom(content: string): ArrayBuffer {
  const bytes = Buffer.from(content);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function createSignedRelease(
  content: string,
  urlSuffix = '?token=secret',
): {
  release: EdgeReleaseArtifactMetadata;
  trustedPublicKeyPem: string;
} {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const checksum = createHash('sha256').update(content).digest('hex');
  const signature = sign(null, Buffer.from(checksum, 'utf8'), privateKey).toString('base64');

  return {
    trustedPublicKeyPem: publicKey.export({ format: 'pem', type: 'spki' }).toString(),
    release: {
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: `https://downloads.example.com/releases/edge-agent.tgz${urlSuffix}`,
      checksum,
      signature,
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'main',
      sizeBytes: Buffer.byteLength(content),
    },
  };
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe('sanitizeArtifactUrl', () => {
  it('strips query and hash fragments from valid URLs', () => {
    expect(sanitizeArtifactUrl('https://example.com/file.tgz?token=secret#part')).toBe(
      'https://example.com/file.tgz',
    );
  });

  it('strips embedded credentials from valid URLs', () => {
    expect(sanitizeArtifactUrl('https://user:pass@example.com/file.tgz?token=secret')).toBe(
      'https://example.com/file.tgz',
    );
  });

  it('returns an invalid placeholder for malformed URLs', () => {
    expect(sanitizeArtifactUrl('not a url')).toBe('[invalid-url]');
  });
});

describe('downloadAndVerifyUpgradeArtifact', () => {
  it('downloads an HTTPS artifact, verifies checksum and signature, and stages it', async () => {
    const content = 'verified artifact bytes';
    const { release, trustedPublicKeyPem } = createSignedRelease(content);
    const stagingDir = await createTempDir('success');
    tempDirs.push(stagingDir);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => arrayBufferFrom(content),
    } as Response);

    const artifact = await downloadAndVerifyUpgradeArtifact({
      release,
      stagingDir,
      trustedPublicKeyPem,
      fetchImpl: fetchMock as typeof fetch,
    });

    expect(fetchMock).toHaveBeenCalledWith(release.url, { redirect: 'manual' });
    expect(artifact.version).toBe(release.version);
    expect(artifact.checksum).toBe(release.checksum);
    expect(artifact.url).toBe('https://downloads.example.com/releases/edge-agent.tgz');
    await expect(readFile(artifact.path, 'utf8')).resolves.toBe(content);
    if (process.platform !== 'win32') {
      const fileMode = (await stat(artifact.path)).mode & 0o777;
      expect(fileMode).toBe(0o600);
    }
  });

  it('disables automatic redirects while downloading', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const stagingDir = await createTempDir('redirect-mode');
    tempDirs.push(stagingDir);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => arrayBufferFrom('content'),
    } as Response);

    await downloadAndVerifyUpgradeArtifact({
      release,
      stagingDir,
      trustedPublicKeyPem,
      fetchImpl: fetchMock as typeof fetch,
    });

    expect(fetchMock).toHaveBeenCalledWith(release.url, { redirect: 'manual' });
  });

  it('rejects redirect responses without following them', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const stagingDir = await createTempDir('redirect-response');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: false,
          status: 302,
          headers: new Headers({ location: 'http://downloads.example.com/insecure.tgz' }),
          arrayBuffer: async () => arrayBufferFrom(''),
        } as Response) as typeof fetch,
      }),
    ).rejects.toThrow('redirect');
  });

  it('rejects non-HTTPS artifact URLs before downloading', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const fetchMock = vi.fn();
    const stagingDir = await createTempDir('http');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release: {
          ...release,
          url: 'http://downloads.example.com/releases/edge-agent.tgz?token=secret',
        },
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: fetchMock as typeof fetch,
      }),
    ).rejects.toThrow('HTTPS');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails when the checksum does not match', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('expected');
    const stagingDir = await createTempDir('checksum');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: async () => arrayBufferFrom('tampered'),
        }) as typeof fetch,
      }),
    ).rejects.toThrow('checksum');
  });

  it('fails when the signature does not match the checksum', async () => {
    const good = createSignedRelease('expected');
    const bad = createSignedRelease('other');
    const stagingDir = await createTempDir('signature');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release: { ...good.release, signature: bad.release.signature },
        stagingDir,
        trustedPublicKeyPem: good.trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: async () => arrayBufferFrom('expected'),
        }) as typeof fetch,
      }),
    ).rejects.toThrow('signature');
  });

  it('does not leak signed URL query strings when fetch rejects', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const stagingDir = await createTempDir('network');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi
          .fn()
          .mockRejectedValue(new Error(`network failed for ${release.url}`)) as typeof fetch,
      }),
    ).rejects.toThrow('download');

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi
          .fn()
          .mockRejectedValue(new Error(`network failed for ${release.url}`)) as typeof fetch,
      }),
    ).rejects.not.toThrow('token=secret');
  });

  it('does not leak signed URL query strings on HTTP status failures', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const stagingDir = await createTempDir('status');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: false,
          status: 503,
          arrayBuffer: async () => arrayBufferFrom(''),
        }) as typeof fetch,
      }),
    ).rejects.toThrow('503');

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: false,
          status: 503,
          arrayBuffer: async () => arrayBufferFrom(''),
        }) as typeof fetch,
      }),
    ).rejects.not.toThrow('token=secret');
  });

  it('rejects unsupported signature algorithms', async () => {
    const { release, trustedPublicKeyPem } = createSignedRelease('content');
    const stagingDir = await createTempDir('algorithm');
    tempDirs.push(stagingDir);

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release: { ...release, signatureAlgorithm: 'rsa' },
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: async () => arrayBufferFrom('content'),
        }) as typeof fetch,
      }),
    ).rejects.toThrow(/unsupported/i);
  });

  it('does not overwrite an existing staged artifact', async () => {
    const content = 'verified artifact bytes';
    const { release, trustedPublicKeyPem } = createSignedRelease(content);
    const stagingDir = await createTempDir('existing-file');
    tempDirs.push(stagingDir);
    await writeFile(join(stagingDir, '1.2.3-edge-agent.tgz'), 'existing');

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: async () => arrayBufferFrom(content),
        }) as typeof fetch,
      }),
    ).rejects.toThrow('already exists');

    await expect(readFile(join(stagingDir, '1.2.3-edge-agent.tgz'), 'utf8')).resolves.toBe(
      'existing',
    );
  });

  it.runIf(process.platform !== 'win32')('does not follow a staged artifact symlink', async () => {
    const content = 'verified artifact bytes';
    const { release, trustedPublicKeyPem } = createSignedRelease(content);
    const stagingDir = await createTempDir('symlink');
    tempDirs.push(stagingDir);
    const targetPath = join(stagingDir, 'target.txt');
    await writeFile(targetPath, 'target');
    await symlink(targetPath, join(stagingDir, '1.2.3-edge-agent.tgz'));

    await expect(
      downloadAndVerifyUpgradeArtifact({
        release,
        stagingDir,
        trustedPublicKeyPem,
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: async () => arrayBufferFrom(content),
        }) as typeof fetch,
      }),
    ).rejects.toThrow('already exists');

    await expect(readFile(targetPath, 'utf8')).resolves.toBe('target');
  });
});
