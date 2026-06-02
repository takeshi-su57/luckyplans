import { BadRequestException, Injectable } from '@nestjs/common';
import { createPublicKey, verify as verifySignature } from 'crypto';
import { getEnvVar } from '@luckyplans/shared';
import { PrismaService } from '../database/prisma.service';

type CreateReleaseInput = {
  version: string;
  windowsUrl: string;
  linuxUrl: string;
  checksum: string;
  signature: string;
  signatureAlgorithm?: string;
  signingKeyId?: string;
  notes?: string;
};

type WorkerUpgradeStatus =
  | 'IDLE'
  | 'UPGRADE_PENDING'
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'ROLLED_BACK';

type EdgeReleaseRecord = {
  id: string;
  version: string;
  windowsUrl: string;
  linuxUrl: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  artifacts?: Array<{
    platform: string;
    arch: string;
    installType: string;
    url: string;
    checksum: string;
    signature: string;
    signatureAlgorithm: string;
    signingKeyId?: string | null;
    sizeBytes?: bigint | number | null;
  }>;
};

type EdgeReleaseArtifactRecord = {
  release: { version: string; notes?: string | null };
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: bigint | number | null;
};

export type EdgeUpgradeArtifactMetadata = {
  version: string;
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: number | null;
};

export type EdgeUpgradeArtifactLookupResult = {
  artifact: EdgeUpgradeArtifactMetadata | null;
  message: string | null;
};

type UpgradeCampaignRecord = {
  id: string;
  targetVersion: string;
  previousVersion?: string | null;
  forceMode: boolean;
  phaseSize: number;
  currentPhase: number;
  successThreshold: number;
  failureThreshold: number;
  status: 'RUNNING' | 'PAUSED' | 'SUCCEEDED' | 'FAILED' | 'ROLLED_BACK';
};

@Injectable()
export class ReleasesService {
  constructor(private readonly prisma: PrismaService) {}

  private get releases() {
    return (
      this.prisma as unknown as {
        edgeRelease: {
          create: (args: unknown) => Promise<EdgeReleaseRecord>;
          findFirst: (args: unknown) => Promise<EdgeReleaseRecord | null>;
          findMany: (args: unknown) => Promise<EdgeReleaseRecord[]>;
        };
        upgradeCampaign: {
          create: (args: unknown) => Promise<UpgradeCampaignRecord>;
          findUnique: (args: unknown) => Promise<UpgradeCampaignRecord | null>;
          update: (args: unknown) => Promise<UpgradeCampaignRecord>;
        };
        upgradeCampaignWorker: {
          createMany: (args: unknown) => Promise<{ count: number }>;
          findMany: (
            args: unknown,
          ) => Promise<
            Array<{ workerId: string; phase: number; status: string; campaignId: string }>
          >;
          updateMany: (args: unknown) => Promise<{ count: number }>;
        };
        worker: {
          updateMany: (args: unknown) => Promise<{ count: number }>;
          update: (args: unknown) => Promise<Record<string, unknown>>;
          findMany: (args: unknown) => Promise<Array<{ id: string; version?: string | null }>>;
          findUnique: (args: unknown) => Promise<{
            id: string;
            targetVersion?: string | null;
            platform?: string | null;
            arch?: string | null;
          } | null>;
        };
        edgeReleaseArtifact: {
          findFirst: (args: unknown) => Promise<EdgeReleaseArtifactRecord | null>;
        };
      }
    ).edgeRelease;
  }

  private get campaigns() {
    return (
      this.prisma as unknown as {
        upgradeCampaign: {
          create: (args: unknown) => Promise<UpgradeCampaignRecord>;
          findUnique: (args: unknown) => Promise<UpgradeCampaignRecord | null>;
          update: (args: unknown) => Promise<UpgradeCampaignRecord>;
        };
      }
    ).upgradeCampaign;
  }

  private get campaignWorkers() {
    return (
      this.prisma as unknown as {
        upgradeCampaignWorker: {
          createMany: (args: unknown) => Promise<{ count: number }>;
          findMany: (
            args: unknown,
          ) => Promise<
            Array<{ workerId: string; phase: number; status: string; campaignId: string }>
          >;
          updateMany: (args: unknown) => Promise<{ count: number }>;
        };
      }
    ).upgradeCampaignWorker;
  }

  private get workers() {
    return (
      this.prisma as unknown as {
        worker: {
          findUnique: (args: unknown) => Promise<{
            id: string;
            targetVersion?: string | null;
            platform?: string | null;
            arch?: string | null;
          } | null>;
        };
      }
    ).worker;
  }

  private get releaseArtifacts() {
    return (
      this.prisma as unknown as {
        edgeReleaseArtifact: {
          findFirst: (args: unknown) => Promise<EdgeReleaseArtifactRecord | null>;
        };
      }
    ).edgeReleaseArtifact;
  }

  async createRelease(input: CreateReleaseInput): Promise<EdgeReleaseRecord> {
    this.validateReleaseInput(input);
    this.verifyReleaseSignature(input);
    const signatureAlgorithm = input.signatureAlgorithm ?? 'ed25519';
    const signingKeyId = input.signingKeyId ?? null;
    return this.releases.create({
      data: {
        ...input,
        signatureAlgorithm,
        signingKeyId,
        artifacts: {
          create: [
            {
              platform: 'win32',
              arch: 'x64',
              installType: 'service',
              url: input.windowsUrl,
              checksum: input.checksum,
              signature: input.signature,
              signatureAlgorithm,
              signingKeyId,
            },
            {
              platform: 'linux',
              arch: 'x64',
              installType: 'service',
              url: input.linuxUrl,
              checksum: input.checksum,
              signature: input.signature,
              signatureAlgorithm,
              signingKeyId,
            },
          ],
        },
      },
    });
  }

  async listReleases(): Promise<EdgeReleaseRecord[]> {
    return this.releases.findMany({
      orderBy: { createdAt: 'desc' },
      include: { artifacts: true },
    });
  }

  async getReleaseForWorkerTarget(workerId: string): Promise<EdgeReleaseRecord | null> {
    const worker = await this.workers.findUnique({
      where: { id: workerId },
      select: { id: true, targetVersion: true },
    });
    if (!worker?.targetVersion) {
      return null;
    }
    return this.releases.findFirst({
      where: { version: worker.targetVersion },
    });
  }

  async getUpgradeArtifactForWorker(input: {
    workerId: string;
    platform?: string | null;
    arch?: string | null;
    installType?: string | null;
  }): Promise<EdgeUpgradeArtifactLookupResult> {
    const worker = await this.workers.findUnique({
      where: { id: input.workerId },
      select: { id: true, targetVersion: true, platform: true, arch: true },
    });

    if (!worker?.targetVersion) {
      return { artifact: null, message: null };
    }

    const platform = this.normalizePlatform(input.platform ?? worker.platform);
    const arch = this.normalizeArch(input.arch ?? worker.arch);
    const installType = this.normalizeInstallType(input.installType);

    if (!platform || !arch) {
      return {
        artifact: null,
        message: `Cannot resolve edge release artifact for ${worker.targetVersion}: platform and arch are required`,
      };
    }

    const artifact = await this.releaseArtifacts.findFirst({
      where: {
        release: { version: worker.targetVersion },
        platform,
        arch,
        installType,
      },
      select: {
        release: { select: { version: true, notes: true } },
        platform: true,
        arch: true,
        installType: true,
        url: true,
        checksum: true,
        signature: true,
        signatureAlgorithm: true,
        signingKeyId: true,
        sizeBytes: true,
      },
    });

    if (!artifact) {
      return {
        artifact: null,
        message: `No compatible edge release artifact found for ${worker.targetVersion} on ${platform}/${arch}/${installType}`,
      };
    }

    return {
      artifact: {
        version: artifact.release.version,
        platform: artifact.platform,
        arch: artifact.arch,
        installType: artifact.installType,
        url: artifact.url,
        checksum: artifact.checksum,
        signature: artifact.signature,
        signatureAlgorithm: artifact.signatureAlgorithm,
        signingKeyId: artifact.signingKeyId ?? null,
        sizeBytes: artifact.sizeBytes == null ? null : Number(artifact.sizeBytes),
      },
      message: null,
    };
  }

  async setWorkerTargetVersion(workerIds: string[], targetVersion: string) {
    const release = await this.releases.findFirst({ where: { version: targetVersion } });
    if (!release) {
      throw new BadRequestException('Target version is not registered as an edge release');
    }
    const result = await this.prisma.worker.updateMany({
      where: { id: { in: workerIds } },
      data: {
        targetVersion,
        upgradeStatus: 'UPGRADE_PENDING',
      },
    });
    return result.count;
  }

  async startUpgradeCampaign(input: {
    workerIds: string[];
    targetVersion: string;
    forceMode?: boolean;
    phaseSize?: number;
    successThreshold?: number;
    failureThreshold?: number;
  }) {
    const release = await this.releases.findFirst({ where: { version: input.targetVersion } });
    if (!release) {
      throw new BadRequestException('Target version is not registered as an edge release');
    }
    const workers = await this.prisma.worker.findMany({
      where: { id: { in: input.workerIds } },
      select: { id: true, version: true },
    });
    const previousVersion = workers.find((worker) => worker.version)?.version ?? null;
    const phaseSize = Math.max(1, input.phaseSize ?? 1);

    const campaign = await this.campaigns.create({
      data: {
        targetVersion: input.targetVersion,
        previousVersion,
        forceMode: Boolean(input.forceMode),
        phaseSize,
        currentPhase: 0,
        successThreshold: input.successThreshold ?? 1,
        failureThreshold: input.failureThreshold ?? 0.5,
        status: 'RUNNING',
      },
    });

    const seeded = workers.map((worker, index) => ({
      campaignId: campaign.id,
      workerId: worker.id,
      phase: Math.floor(index / phaseSize),
      status: index < phaseSize ? 'IN_PROGRESS' : 'PENDING',
    }));
    await this.campaignWorkers.createMany({ data: seeded });

    const wave = seeded.filter((item) => item.phase === 0).map((item) => item.workerId);
    if (wave.length > 0) {
      await this.prisma.worker.updateMany({
        where: { id: { in: wave } },
        data: { targetVersion: input.targetVersion, upgradeStatus: 'UPGRADE_PENDING' },
      });
    }

    return campaign;
  }

  async advanceUpgradeCampaign(campaignId: string) {
    const campaign = await this.campaigns.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new BadRequestException('Upgrade campaign not found');
    if (campaign.status !== 'RUNNING') return campaign;

    const workers = await this.campaignWorkers.findMany({ where: { campaignId } });
    const phaseWorkers = workers.filter((worker) => worker.phase === campaign.currentPhase);
    if (phaseWorkers.length === 0) return campaign;

    const successRatio =
      phaseWorkers.filter((worker) => worker.status === 'SUCCEEDED').length / phaseWorkers.length;
    const failureRatio =
      phaseWorkers.filter((worker) => worker.status === 'FAILED').length / phaseWorkers.length;

    if (failureRatio >= campaign.failureThreshold) {
      return this.campaigns.update({
        where: { id: campaignId },
        data: { status: 'PAUSED' },
      });
    }
    if (successRatio < campaign.successThreshold) {
      return campaign;
    }

    const nextPhase = campaign.currentPhase + 1;
    const nextWorkers = workers.filter((worker) => worker.phase === nextPhase);
    if (nextWorkers.length === 0) {
      return this.campaigns.update({
        where: { id: campaignId },
        data: { status: 'SUCCEEDED' },
      });
    }

    await this.campaignWorkers.updateMany({
      where: { campaignId, phase: nextPhase, status: 'PENDING' },
      data: { status: 'IN_PROGRESS' },
    });
    await this.prisma.worker.updateMany({
      where: { id: { in: nextWorkers.map((worker) => worker.workerId) } },
      data: { targetVersion: campaign.targetVersion, upgradeStatus: 'UPGRADE_PENDING' },
    });

    return this.campaigns.update({
      where: { id: campaignId },
      data: { currentPhase: nextPhase },
    });
  }

  async rollbackUpgradeCampaign(campaignId: string) {
    const campaign = await this.campaigns.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new BadRequestException('Upgrade campaign not found');

    const workers = await this.campaignWorkers.findMany({ where: { campaignId } });
    await this.prisma.worker.updateMany({
      where: { id: { in: workers.map((worker) => worker.workerId) } },
      data: {
        targetVersion: campaign.previousVersion ?? null,
        upgradeStatus: 'ROLLED_BACK',
      },
    });
    await this.campaignWorkers.updateMany({
      where: { campaignId },
      data: { status: 'ROLLED_BACK' },
    });

    return this.campaigns.update({
      where: { id: campaignId },
      data: { status: 'ROLLED_BACK' },
    });
  }

  async reportWorkerUpgradeStatus(workerId: string, status: WorkerUpgradeStatus, message?: string) {
    const updated = await this.prisma.worker.update({
      where: { id: workerId },
      data: {
        upgradeStatus: status,
        upgradeMessage: message ?? null,
      },
    });
    await this.campaignWorkers.updateMany({
      where: { workerId, status: 'IN_PROGRESS' },
      data: {
        status:
          status === 'SUCCEEDED' ? 'SUCCEEDED' : status === 'FAILED' ? 'FAILED' : 'IN_PROGRESS',
      },
    });
    return updated;
  }

  private validateReleaseInput(input: CreateReleaseInput) {
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(input.version)) {
      throw new BadRequestException('Invalid release version format');
    }
    if (!/^[a-f0-9]{64}$/i.test(input.checksum)) {
      throw new BadRequestException('Invalid release checksum format');
    }
    if (!input.signature.trim()) {
      throw new BadRequestException('Release signature is required');
    }
    if (!/^https:\/\//.test(input.windowsUrl) || !/^https:\/\//.test(input.linuxUrl)) {
      throw new BadRequestException('Release URLs must use HTTPS');
    }
  }

  private verifyReleaseSignature(input: CreateReleaseInput) {
    const publicKeyPem = getEnvVar('EDGE_RELEASE_SIGNING_PUBLIC_KEY');
    const key = createPublicKey(publicKeyPem);
    const payload = Buffer.from(input.checksum, 'utf8');
    const signature = Buffer.from(input.signature, 'base64');
    const ok = verifySignature(null, payload, key, signature);
    if (!ok) {
      throw new BadRequestException('Release signature verification failed');
    }
  }

  private normalizePlatform(platform: string | null | undefined): string | null {
    if (!platform) return null;
    const normalized = platform.toLowerCase();
    if (normalized === 'windows') return 'win32';
    if (normalized === 'win32') return 'win32';
    if (normalized === 'linux') return 'linux';
    return normalized;
  }

  private normalizeArch(arch: string | null | undefined): string | null {
    if (!arch) return null;
    const normalized = arch.toLowerCase();
    if (normalized === 'amd64') return 'x64';
    if (normalized === 'x86_64') return 'x64';
    if (normalized === 'arm64' || normalized === 'aarch64') return 'arm64';
    return normalized;
  }

  private normalizeInstallType(installType: string | null | undefined): string {
    return installType?.toLowerCase() || 'service';
  }
}
