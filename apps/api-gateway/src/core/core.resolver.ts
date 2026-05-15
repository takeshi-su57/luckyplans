import { Inject } from '@nestjs/common';
import {
  Args,
  Query,
  Mutation,
  Resolver,
  ObjectType,
  Field,
  ID,
  registerEnumType,
} from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern, WorkerStatus, injectTraceContext } from '@luckyplans/shared';

registerEnumType(WorkerStatus, { name: 'WorkerStatus' });

@ObjectType()
class Item {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt!: Date;
}

@ObjectType()
class ItemsResponse {
  @Field(() => [Item])
  items!: Item[];

  @Field()
  total!: number;
}

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
export class CoreResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => ItemsResponse)
  async getItems(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<ItemsResponse> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.GET_ITEMS, injectTraceContext({ page, limit })),
    );
  }

  @Query(() => Item, { nullable: true })
  async getItem(@Args('id') id: string): Promise<Item> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.GET_ITEM, injectTraceContext({ id })),
    );
  }

  @Mutation(() => Item)
  async createItem(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Item> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_ITEM,
        injectTraceContext({ name, description }),
      ),
    );
  }

  @Query(() => [Worker])
  async workers(): Promise<Worker[]> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.GET_WORKERS, injectTraceContext({})),
    );
  }

  @Mutation(() => Worker)
  async createWorker(
    @Args('name') name: string,
    @Args('platform', { nullable: true }) platform?: string,
    @Args('version', { nullable: true }) version?: string,
  ): Promise<Worker> {
    return firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.CREATE_WORKER,
        injectTraceContext({ name, platform, version }),
      ),
    );
  }

  @Mutation(() => Worker, { nullable: true })
  async disableWorker(@Args('id') id: string): Promise<Worker | null> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.DISABLE_WORKER, injectTraceContext({ id })),
    );
  }
}
