import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SessionGuard } from '../auth/session.guard';
import { RealtimeEventsService } from '../graphql/realtime-events.service';
import { ReleasesService } from './releases.service';

@ObjectType()
class EdgeReleaseArtifact {
  @Field()
  platform!: string;

  @Field()
  arch!: string;

  @Field()
  installType!: string;

  @Field()
  url!: string;

  @Field()
  checksum!: string;

  @Field()
  signature!: string;

  @Field()
  signatureAlgorithm!: string;

  @Field({ nullable: true })
  signingKeyId?: string;

  @Field(() => Int, { nullable: true })
  sizeBytes?: number;
}

@InputType()
class EdgeReleaseArtifactInput {
  @Field({ nullable: true })
  version?: string;

  @Field()
  platform!: string;

  @Field()
  arch!: string;

  @Field()
  installType!: string;

  @Field()
  url!: string;

  @Field()
  checksum!: string;

  @Field()
  signature!: string;

  @Field({ nullable: true })
  signatureAlgorithm?: string;

  @Field({ nullable: true })
  signingKeyId?: string;

  @Field(() => Int, { nullable: true })
  sizeBytes?: number;
}

@ObjectType()
class EdgeRelease {
  @Field(() => ID)
  id!: string;

  @Field()
  version!: string;

  @Field()
  windowsUrl!: string;

  @Field()
  linuxUrl!: string;

  @Field()
  checksum!: string;

  @Field()
  signature!: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [EdgeReleaseArtifact])
  artifacts!: EdgeReleaseArtifact[];
}

@ObjectType()
class UpgradeCampaign {
  @Field(() => ID)
  id!: string;

  @Field()
  targetVersion!: string;

  @Field({ nullable: true })
  previousVersion?: string;

  @Field()
  forceMode!: boolean;

  @Field()
  phaseSize!: number;

  @Field()
  currentPhase!: number;

  @Field()
  successThreshold!: number;

  @Field()
  failureThreshold!: number;

  @Field()
  status!: string;
}

@Resolver()
export class ReleasesResolver {
  constructor(
    private readonly releasesService: ReleasesService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  @Mutation(() => EdgeRelease)
  @UseGuards(SessionGuard)
  async createEdgeRelease(
    @Args('version') version: string,
    @Args('windowsUrl') windowsUrl: string,
    @Args('linuxUrl') linuxUrl: string,
    @Args('checksum') checksum: string,
    @Args('signature') signature: string,
    @Args('artifacts', { type: () => [EdgeReleaseArtifactInput], nullable: true })
    artifacts?: EdgeReleaseArtifactInput[],
    @Args('notes', { nullable: true }) notes?: string,
  ): Promise<EdgeRelease> {
    const created = await this.releasesService.createRelease({
      version,
      windowsUrl,
      linuxUrl,
      checksum,
      signature,
      artifacts,
      notes,
    });
    return {
      ...created,
      notes: created.notes ?? undefined,
      artifacts: (created.artifacts ?? []).map((artifact) => ({
        ...artifact,
        signingKeyId: artifact.signingKeyId ?? undefined,
        sizeBytes: artifact.sizeBytes == null ? undefined : Number(artifact.sizeBytes),
      })),
    };
  }

  @Query(() => [EdgeRelease])
  @UseGuards(SessionGuard)
  async edgeReleases(): Promise<EdgeRelease[]> {
    const releases = await this.releasesService.listReleases();
    return releases.map((release) => ({
      ...release,
      notes: release.notes ?? undefined,
      artifacts: (release.artifacts ?? []).map((artifact) => ({
        ...artifact,
        signingKeyId: artifact.signingKeyId ?? undefined,
        sizeBytes: artifact.sizeBytes == null ? undefined : Number(artifact.sizeBytes),
      })),
    }));
  }

  @Mutation(() => Int)
  @UseGuards(SessionGuard)
  async setWorkerTargetVersion(
    @Args('workerIds', { type: () => [String] }) workerIds: string[],
    @Args('targetVersion') targetVersion: string,
  ): Promise<number> {
    return this.releasesService.setWorkerTargetVersion(workerIds, targetVersion);
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async reportWorkerUpgradeStatus(
    @Args('workerId') workerId: string,
    @Args('status') status: string,
    @Args('message', { nullable: true }) message?: string,
  ): Promise<boolean> {
    const updated = await this.releasesService.reportWorkerUpgradeStatus(
      workerId,
      status as
        | 'IDLE'
        | 'UPGRADE_PENDING'
        | 'DOWNLOADING'
        | 'VERIFYING'
        | 'RESTARTING'
        | 'SUCCEEDED'
        | 'FAILED'
        | 'ROLLED_BACK',
      message,
    );
    await this.realtimeEvents.publishWorkerUpgradeStatusUpdated(updated);
    return true;
  }

  @Mutation(() => UpgradeCampaign)
  @UseGuards(SessionGuard)
  async startUpgradeCampaign(
    @Args('workerIds', { type: () => [String] }) workerIds: string[],
    @Args('targetVersion') targetVersion: string,
    @Args('forceMode', { nullable: true }) forceMode?: boolean,
    @Args('phaseSize', { nullable: true }) phaseSize?: number,
    @Args('successThreshold', { nullable: true }) successThreshold?: number,
    @Args('failureThreshold', { nullable: true }) failureThreshold?: number,
  ): Promise<UpgradeCampaign> {
    return this.releasesService.startUpgradeCampaign({
      workerIds,
      targetVersion,
      forceMode,
      phaseSize,
      successThreshold,
      failureThreshold,
    });
  }

  @Mutation(() => UpgradeCampaign)
  @UseGuards(SessionGuard)
  async advanceUpgradeCampaign(@Args('campaignId') campaignId: string): Promise<UpgradeCampaign> {
    return this.releasesService.advanceUpgradeCampaign(campaignId);
  }

  @Mutation(() => UpgradeCampaign)
  @UseGuards(SessionGuard)
  async rollbackUpgradeCampaign(@Args('campaignId') campaignId: string): Promise<UpgradeCampaign> {
    return this.releasesService.rollbackUpgradeCampaign(campaignId);
  }
}
