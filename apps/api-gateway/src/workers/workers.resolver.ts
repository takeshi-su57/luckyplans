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

const WorkerRuntimeState = {
  IDLE: 'IDLE',
  BUSY: 'BUSY',
  UPGRADING: 'UPGRADING',
  ERROR: 'ERROR',
} as const;
type WorkerRuntimeState = (typeof WorkerRuntimeState)[keyof typeof WorkerRuntimeState];

registerEnumType(WorkerRuntimeState, { name: 'WorkerRuntimeState' });

const WorkerConnectivityStatus = {
  ONLINE: 'ONLINE',
  STALE: 'STALE',
  OFFLINE: 'OFFLINE',
} as const;
type WorkerConnectivityStatus =
  (typeof WorkerConnectivityStatus)[keyof typeof WorkerConnectivityStatus];

registerEnumType(WorkerConnectivityStatus, { name: 'WorkerConnectivityStatus' });

const DEFAULT_CONNECTIVITY_STATUS: WorkerConnectivityStatus = 'OFFLINE';

@ObjectType()
class Worker {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  deviceNumber?: string | null;

  @Field({ nullable: true })
  platform?: string | null;

  @Field({ nullable: true })
  arch?: string | null;

  @Field({ nullable: true })
  version?: string | null;

  @Field()
  hasActiveCredential!: boolean;

  @Field(() => WorkerStatus)
  status!: WorkerStatus;

  @Field({ nullable: true })
  lastSeenAt?: Date | null;

  @Field({ nullable: true })
  targetVersion?: string | null;

  @Field(() => WorkerUpgradeStatus)
  upgradeStatus!: WorkerUpgradeStatus;

  @Field({ nullable: true })
  upgradeMessage?: string | null;

  @Field(() => WorkerRuntimeState)
  runtimeState!: WorkerRuntimeState;

  @Field({ nullable: true })
  activeTaskId?: string | null;

  @Field({ nullable: true })
  uptimeSeconds?: number | null;

  @Field({ nullable: true })
  lastError?: string | null;

  @Field(() => WorkerConnectivityStatus)
  connectivityStatus!: WorkerConnectivityStatus;

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
    const result: Worker = {
      ...created,
      hasActiveCredential: false,
      connectivityStatus: DEFAULT_CONNECTIVITY_STATUS,
    };
    await this.realtimeEvents.publishWorkerStatusUpdated(result);
    return result;
  }

  @Mutation(() => Worker, { nullable: true })
  async disableWorker(@Args('id') id: string): Promise<Worker | null> {
    const updated = await this.workersService.disableWorker(id);
    if (updated) {
      const result: Worker = {
        ...updated,
        hasActiveCredential: false,
        connectivityStatus: DEFAULT_CONNECTIVITY_STATUS,
      };
      await this.realtimeEvents.publishWorkerStatusUpdated(result);
      return result;
    }
    return null;
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
