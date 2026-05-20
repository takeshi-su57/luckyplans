import { Args, Field, ID, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ReleasesService } from './releases.service';

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
}

@Resolver()
export class ReleasesResolver {
  constructor(private readonly releasesService: ReleasesService) {}

  @Mutation(() => EdgeRelease)
  async createEdgeRelease(
    @Args('version') version: string,
    @Args('windowsUrl') windowsUrl: string,
    @Args('linuxUrl') linuxUrl: string,
    @Args('checksum') checksum: string,
    @Args('signature') signature: string,
    @Args('notes', { nullable: true }) notes?: string,
  ): Promise<EdgeRelease> {
    const created = await this.releasesService.createRelease({
      version,
      windowsUrl,
      linuxUrl,
      checksum,
      signature,
      notes,
    });
    return {
      ...created,
      notes: created.notes ?? undefined,
    };
  }

  @Query(() => [EdgeRelease])
  async edgeReleases(): Promise<EdgeRelease[]> {
    const releases = await this.releasesService.listReleases();
    return releases.map((release) => ({
      ...release,
      notes: release.notes ?? undefined,
    }));
  }

  @Mutation(() => Int)
  async setWorkerTargetVersion(
    @Args('workerIds', { type: () => [String] }) workerIds: string[],
    @Args('targetVersion') targetVersion: string,
  ): Promise<number> {
    return this.releasesService.setWorkerTargetVersion(workerIds, targetVersion);
  }

  @Mutation(() => Boolean)
  async reportWorkerUpgradeStatus(
    @Args('workerId') workerId: string,
    @Args('status') status: string,
    @Args('message', { nullable: true }) message?: string,
  ): Promise<boolean> {
    await this.releasesService.reportWorkerUpgradeStatus(
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
    return true;
  }
}
