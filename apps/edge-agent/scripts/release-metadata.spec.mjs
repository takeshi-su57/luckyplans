import { generateKeyPairSync, verify } from 'crypto';
import { describe, expect, it } from 'vitest';
import {
  assertValidVersion,
  buildArtifactName,
  buildArtifactRecord,
  DEFAULT_RELEASE_TARGETS,
  sha256Hex,
  signChecksum,
} from './release-metadata.mjs';

describe('edge release metadata helpers', () => {
  it('builds stable Linux and Windows service artifact names', () => {
    expect(
      buildArtifactName({
        version: '1.2.3',
        platform: 'linux',
        arch: 'x64',
        installType: 'service',
      }),
    ).toBe('luckyplans-edge-agent-v1.2.3-linux-x64-service.tar.gz');
    expect(
      buildArtifactName({
        version: '1.2.3',
        platform: 'win32',
        arch: 'x64',
        installType: 'service',
      }),
    ).toBe('luckyplans-edge-agent-v1.2.3-win32-x64-service.zip');
  });

  it('supports Linux and Windows x64 service targets by default', () => {
    expect(DEFAULT_RELEASE_TARGETS).toEqual([
      { platform: 'linux', arch: 'x64', installType: 'service' },
      { platform: 'win32', arch: 'x64', installType: 'service' },
    ]);
  });

  it('rejects invalid release versions', () => {
    expect(() => assertValidVersion('latest')).toThrow('Invalid edge release version');
  });

  it('generates sha256 checksums and verifiable Ed25519 signatures', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const checksum = sha256Hex(Buffer.from('edge-agent'));
    const signature = signChecksum(
      checksum,
      privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
    );

    expect(checksum).toMatch(/^[a-f0-9]{64}$/);
    expect(
      verify(null, Buffer.from(checksum, 'utf8'), publicKey, Buffer.from(signature, 'base64')),
    ).toBe(true);
  });

  it('accepts private keys with escaped newlines', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const checksum = sha256Hex(Buffer.from('edge-agent'));
    const escapedPrivateKey = privateKey
      .export({ type: 'pkcs8', format: 'pem' })
      .toString()
      .replace(/\n/g, '\\n');
    const signature = signChecksum(checksum, escapedPrivateKey);

    expect(
      verify(null, Buffer.from(checksum, 'utf8'), publicKey, Buffer.from(signature, 'base64')),
    ).toBe(true);
  });

  it('builds gateway-compatible artifact metadata records', () => {
    const record = buildArtifactRecord({
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      baseUrl: 'https://github.com/takeshi-su57/luckyplans/releases/download/edge-agent-v1.2.3',
      checksum: 'a'.repeat(64),
      signature: 'signature',
      signingKeyId: 'edge-release-2026-06',
      sizeBytes: 1234,
    });

    expect(record).toEqual({
      version: '1.2.3',
      platform: 'linux',
      arch: 'x64',
      installType: 'service',
      url: 'https://github.com/takeshi-su57/luckyplans/releases/download/edge-agent-v1.2.3/luckyplans-edge-agent-v1.2.3-linux-x64-service.tar.gz',
      checksum: 'a'.repeat(64),
      signature: 'signature',
      signatureAlgorithm: 'ed25519',
      signingKeyId: 'edge-release-2026-06',
      sizeBytes: 1234,
    });
  });
});
