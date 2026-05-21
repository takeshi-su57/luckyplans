import {
  Args,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
  registerEnumType,
} from '@nestjs/graphql';
import { RealtimeEventsService } from '../graphql/realtime-events.service';
import { WorkersService } from './workers.service';

const WorkerStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
  QUARANTINED: 'QUARANTINED',
} as const;
type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];

registerEnumType(WorkerStatus, { name: 'WorkerStatus' });

const WorkerUpgradeStatus = {
  IDLE: 'IDLE',
  UPGRADE_PENDING: 'UPGRADE_PENDING',
  DOWNLOADING: 'DOWNLOADING',
  VERIFYING: 'VERIFYING',
  RESTARTING: 'RESTARTING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  ROLLED_BACK: 'ROLLED_BACK',
} as const;
type WorkerUpgradeStatus = (typeof WorkerUpgradeStatus)[keyof typeof WorkerUpgradeStatus];

registerEnumType(WorkerUpgradeStatus, { name: 'WorkerUpgradeStatus' });

@ObjectType()
class Worker {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  deviceNumber?: string;

  @Field({ nullable: true })
  platform?: string;

  @Field({ nullable: true })
  arch?: string;

  @Field({ nullable: true })
  version?: string;

  @Field()
  hasActiveCredential!: boolean;

  @Field(() => WorkerStatus)
  status!: WorkerStatus;

  @Field({ nullable: true })
  lastSeenAt?: Date;

  @Field({ nullable: true })
  targetVersion?: string;

  @Field(() => WorkerUpgradeStatus)
  upgradeStatus!: WorkerUpgradeStatus;

  @Field({ nullable: true })
  upgradeMessage?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@Resolver()
export class WorkersResolver {
  constructor(
    private readonly workersService: WorkersService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  @Query(() => [Worker])
  async workers(): Promise<Worker[]> {
    return this.workersService.getWorkers();
  }

  @Mutation(() => Worker)
  async createWorker(
    @Args('name') name: string,
    @Args('deviceNumber', { nullable: true }) deviceNumber?: string,
    @Args('platform', { nullable: true }) platform?: string,
    @Args('arch', { nullable: true }) arch?: string,
    @Args('version', { nullable: true }) version?: string,
  ): Promise<Worker> {
    const created = await this.workersService.createWorker({
      name,
      deviceNumber,
      platform,
      arch,
      version,
    });
    await this.realtimeEvents.publishWorkerStatusUpdated(created);
    return created;
  }

  @Mutation(() => Worker, { nullable: true })
  async disableWorker(@Args('id') id: string): Promise<Worker | null> {
    const updated = await this.workersService.disableWorker(id);
    if (updated) {
      await this.realtimeEvents.publishWorkerStatusUpdated(updated);
    }
    return updated;
  }

  @Subscription(() => Worker)
  workerStatusUpdated() {
    return this.realtimeEvents.workerStatusUpdatedIterator();
  }

  @Subscription(() => Worker)
  workerUpgradeStatusUpdated() {
    return this.realtimeEvents.workerUpgradeStatusUpdatedIterator();
  }
}
