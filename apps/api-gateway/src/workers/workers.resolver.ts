import { Args, Field, ID, Mutation, ObjectType, Query, Resolver, registerEnumType } from '@nestjs/graphql';
import { WorkersService } from './workers.service';

const WorkerStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
} as const;
type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];

registerEnumType(WorkerStatus, { name: 'WorkerStatus' });

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
