import { Inject } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ObjectType, Field, ID } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern } from '@luckyplans/shared';

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

@Resolver()
export class CoreResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => ItemsResponse)
  async getItems(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<ItemsResponse> {
    return firstValueFrom(this.coreClient.send(CoreMessagePattern.GET_ITEMS, { page, limit }));
  }

  @Query(() => Item, { nullable: true })
  async getItem(@Args('id') id: string): Promise<Item> {
    return firstValueFrom(this.coreClient.send(CoreMessagePattern.GET_ITEM, { id }));
  }

  @Mutation(() => Item)
  async createItem(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Item> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.CREATE_ITEM, { name, description }),
    );
  }
}
