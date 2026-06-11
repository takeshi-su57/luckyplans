#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { cp } from 'fs/promises';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  DEFAULT_RELEASE_TARGETS,
  assertValidVersion,
  buildArtifactName,
  buildArtifactRecord,
  sha256Hex,
  signChecksum,
} from './release-metadata.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const repoRoot = resolve(packageRoot, '..', '..');

async function main() {
  const options = parseArgs(process.argv.slice(2));
  assertValidVersion(options.version);

  const privateKeyPem = process.env.EDGE_RELEASE_SIGNING_PRIVATE_KEY;
  if (!privateKeyPem) {
    throw new Error('EDGE_RELEASE_SIGNING_PRIVATE_KEY is required');
  }

  const distDir = join(packageRoot, 'dist');
  if (!existsSync(distDir)) {
    throw new Error(
      'Build output is missing. Run pnpm --filter @luckyplans/edge-agent build first.',
    );
  }

  const outputDir = resolve(
    repoRoot,
    options.outDir ?? `dist/edge-agent-releases/v${options.version}`,
  );
  const stageRoot = join(outputDir, 'staging');
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(stageRoot, { recursive: true });

  const artifacts = [];
  const checksumLines = [];

  for (const target of DEFAULT_RELEASE_TARGETS) {
    const artifactName = buildArtifactName({ version: options.version, ...target });
    const packageDir = join(stageRoot, artifactName.replace(/\.(tar\.gz|zip)$/, ''));
    await stagePackage({
      packageDir,
      version: options.version,
      target,
    });

    const artifactPath = join(outputDir, artifactName);
    if (target.platform === 'win32') {
      createZipArchive({ sourceDir: packageDir, artifactPath });
    } else {
      createTarGzArchive({ sourceDir: packageDir, artifactPath });
    }

    const artifactBytes = readFileSync(artifactPath);
    const checksum = sha256Hex(artifactBytes);
    const signature = signChecksum(checksum, privateKeyPem);
    const sizeBytes = statSync(artifactPath).size;
    const record = buildArtifactRecord({
      version: options.version,
      ...target,
      baseUrl: options.baseUrl,
      checksum,
      signature,
      signingKeyId: options.signingKeyId,
      sizeBytes,
    });

    artifacts.push(record);
    checksumLines.push(`${checksum}  ${artifactName}`);
    writeFileSync(`${artifactPath}.sig`, `${signature}\n`);
  }

  const manifest = {
    version: options.version,
    generatedAt: new Date().toISOString(),
    signatureAlgorithm: 'ed25519',
    signingKeyId: options.signingKeyId,
    artifacts,
  };

  writeFileSync(join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(outputDir, 'SHA256SUMS'), `${checksumLines.join('\n')}\n`);
  rmSync(stageRoot, { recursive: true, force: true });

  console.log(`Wrote edge-agent release artifacts to ${relative(repoRoot, outputDir)}`);
}

function parseArgs(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === '--') {
      continue;
    } else if (arg === '--version' && next) {
      options.version = next;
      index += 1;
    } else if (arg === '--base-url' && next) {
      options.baseUrl = next;
      index += 1;
    } else if (arg === '--out-dir' && next) {
      options.outDir = next;
      index += 1;
    } else if (arg === '--signing-key-id' && next) {
      options.signingKeyId = next;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  if (!options.version) {
    throw new Error('--version is required');
  }
  if (!options.baseUrl) {
    throw new Error('--base-url is required');
  }

  return options;
}

async function stagePackage({ packageDir, version, target }) {
  mkdirSync(packageDir, { recursive: true });
  await cp(join(packageRoot, 'dist'), join(packageDir, 'dist'), { recursive: true });
  await cp(join(packageRoot, 'package.json'), join(packageDir, 'package.json'));
  writeFileSync(
    join(packageDir, 'README.md'),
    [
      `# LuckyPlans Edge Agent ${version}`,
      '',
      `Target: ${target.platform}/${target.arch}/${target.installType}`,
      '',
      'Run with:',
      '',
      '```bash',
      'node dist/main.js',
      '```',
      '',
    ].join('\n'),
  );
}

function createTarGzArchive({ sourceDir, artifactPath }) {
  runCommand('tar', ['-czf', artifactPath, '-C', dirname(sourceDir), basenamePath(sourceDir)]);
}

function createZipArchive({ sourceDir, artifactPath }) {
  if (process.platform === 'win32') {
    runCommand('powershell.exe', [
      '-NoProfile',
      '-Command',
      `Compress-Archive -LiteralPath '${sourceDir}' -DestinationPath '${artifactPath}' -Force`,
    ]);
    return;
  }

  runCommand('zip', ['-qr', artifactPath, basenamePath(sourceDir)], { cwd: dirname(sourceDir) });
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function basenamePath(path) {
  return path.split(/[\\/]/).at(-1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
