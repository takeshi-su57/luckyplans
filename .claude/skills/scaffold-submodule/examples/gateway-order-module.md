# Example: Add "Order" Gateway Module

Adds an order module to the API gateway that forwards to `service-core`.

## Step 1: Define Shared Types

In `packages/shared/src/types/index.ts`, add:

```typescript
export interface Order {
  id: string;
  userId: string;
  symbol: string;
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

export interface CreateOrderDto {
  userId: string;
  symbol: string;
  quantity: number;
  price: number;
}

// Add to existing CoreMessagePattern enum:
export enum CoreMessagePattern {
  // ...existing patterns...
  GET_ORDERS = 'core.getOrders',
  GET_ORDER = 'core.getOrder',
  CREATE_ORDER = 'core.createOrder',
}
```

Then: `pnpm --filter @luckyplans/shared build`

## Step 2: Create Module

Directory: `apps/api-gateway/src/order/`

### `order.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CORE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [OrderResolver],
})
export class OrderModule {}
```

### `order.resolver.ts`

```typescript
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Mutation, Resolver, ObjectType, Field, ID } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern } from '@luckyplans/shared';
import type { Order, CreateOrderDto, AuthUser } from '@luckyplans/shared';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// GraphQL types — mirror the shared Order interface
@ObjectType()
class OrderType {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  symbol!: string;

  @Field(() => Int)
  quantity!: number;

  @Field()
  price!: number;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;
}

@ObjectType()
class OrdersResponse {
  @Field(() => [OrderType])
  items!: Order[];

  @Field(() => Int)
  total!: number;
}

@Resolver()
export class OrderResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @UseGuards(SessionGuard)
  @Query(() => OrdersResponse)
  async getOrders(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @CurrentUser() user: AuthUser,
  ): Promise<OrdersResponse> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.GET_ORDERS, { userId: user.userId, page, limit }),
    );
  }

  @UseGuards(SessionGuard)
  @Mutation(() => OrderType)
  async createOrder(
    @Args('symbol') symbol: string,
    @Args('quantity', { type: () => Int }) quantity: number,
    @Args('price') price: number,
    @CurrentUser() user: AuthUser,
  ): Promise<Order> {
    return firstValueFrom(
      this.coreClient.send(CoreMessagePattern.CREATE_ORDER, {
        userId: user.userId,
        symbol,
        quantity,
        price,
      }),
    );
  }
}
```

> **Auth:** `userId` comes from the authenticated session via `@CurrentUser()` — never accept it as a client argument. This prevents users from accessing or creating orders on behalf of others.

## Step 3: Register

In `apps/api-gateway/src/app.module.ts`:

```typescript
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({ ... }),
    HealthModule,
    AuthModule,
    CoreModule,
    OrderModule,  // added
  ],
})
export class AppModule {}
```
