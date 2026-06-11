import { createHash, createPrivateKey, sign } from 'crypto';

export const DEFAULT_RELEASE_TARGETS = [
  { platform: 'linux', arch: 'x64', installType: 'service' },
  { platform: 'win32', arch: 'x64', installType: 'service' },
];

const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

export function assertValidVersion(version) {
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`Invalid edge release version: ${version}`);
  }
}

export function buildArtifactName({ version, platform, arch, installType }) {
  assertValidVersion(version);
  const extension = platform === 'win32' ? 'zip' : 'tar.gz';
  return `luckyplans-edge-agent-v${version}-${platform}-${arch}-${installType}.${extension}`;
}

export function sha256Hex(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function signChecksum(checksum, privateKeyPem) {
  if (!/^[a-f0-9]{64}$/i.test(checksum)) {
    throw new Error('Invalid checksum format');
  }
  const key = createPrivateKey(privateKeyPem.replace(/\\n/g, '\n'));
  return sign(null, Buffer.from(checksum, 'utf8'), key).toString('base64');
}

export function buildArtifactRecord({
  version,
  platform,
  arch,
  installType,
  baseUrl,
  checksum,
  signature,
  signingKeyId,
  sizeBytes,
}) {
  const artifactName = buildArtifactName({ version, platform, arch, installType });
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  return {
    version,
    platform,
    arch,
    installType,
    url: `${normalizedBaseUrl}/${artifactName}`,
    checksum,
    signature,
    signatureAlgorithm: 'ed25519',
    signingKeyId,
    sizeBytes,
  };
}
