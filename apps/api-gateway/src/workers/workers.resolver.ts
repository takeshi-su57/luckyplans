import {
  Args,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  registerEnumType,
} from '@nestjs/graphql';
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
  platform?: string;

  @Field({ nullable: true })
  version?: string;

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
  constructor(private readonly workersService: WorkersService) {}

  @Query(() => [Worker])
  async workers(): Promise<Worker[]> {
    return this.workersService.getWorkers();
  }

  @Mutation(() => Worker)
  async createWorker(
    @Args('name') name: string,
    @Args('platform', { nullable: true }) platform?: string,
    @Args('version', { nullable: true }) version?: string,
  ): Promise<Worker> {
    return this.workersService.createWorker({ name, platform, version });
  }

  @Mutation(() => Worker, { nullable: true })
  async disableWorker(@Args('id') id: string): Promise<Worker | null> {
    return this.workersService.disableWorker(id);
  }
}
