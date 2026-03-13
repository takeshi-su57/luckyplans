# Example: Scaffold "Trading" Microservice

A trading engine service with complex business logic that justifies its own microservice.

## Step 1: Shared Types

Add to `packages/shared/src/types/index.ts`:

```typescript
export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  executedAt: Date;
}

export interface ExecuteTradeDto {
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
}

export enum TradingMessagePattern {
  EXECUTE_TRADE = 'trading.executeTrade',
  GET_PORTFOLIO = 'trading.getPortfolio',
  GET_TRADE_HISTORY = 'trading.getTradeHistory',
}
```

## Step 2: Microservice App

Create `apps/service-trading/`:

### `src/trading.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { generateId } from '@luckyplans/shared';
import type { Trade, ExecuteTradeDto, ServiceResponse } from '@luckyplans/shared';

@Injectable()
export class TradingService {
  private trades: Trade[] = [];

  async executeTrade(dto: ExecuteTradeDto): Promise<ServiceResponse<Trade>> {
    // Complex trading logic — order matching, portfolio validation, etc.
    const trade: Trade = {
      id: generateId(),
      ...dto,
      price: 100.0, // placeholder — real price from order book
      executedAt: new Date(),
    };
    this.trades.push(trade);
    return { success: true, data: trade, message: 'Trade executed' };
  }

  async getPortfolio(userId: string) {
    return { positions: [], totalValue: 0 };
  }

  async getTradeHistory(userId: string, page: number, limit: number) {
    const userTrades = this.trades.filter((t) => t.userId === userId);
    const start = (page - 1) * limit;
    return {
      items: userTrades.slice(start, start + limit),
      total: userTrades.length,
    };
  }
}
```

### `src/trading.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TradingMessagePattern } from '@luckyplans/shared';
import type { ExecuteTradeDto } from '@luckyplans/shared';
import { TradingService } from './trading.service';

@Controller()
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @MessagePattern(TradingMessagePattern.EXECUTE_TRADE)
  async executeTrade(@Payload() data: ExecuteTradeDto) {
    return this.tradingService.executeTrade(data);
  }

  @MessagePattern(TradingMessagePattern.GET_PORTFOLIO)
  async getPortfolio(@Payload() data: { userId: string }) {
    return this.tradingService.getPortfolio(data.userId);
  }

  @MessagePattern(TradingMessagePattern.GET_TRADE_HISTORY)
  async getTradeHistory(@Payload() data: { userId: string; page: number; limit: number }) {
    return this.tradingService.getTradeHistory(data.userId, data.page, data.limit);
  }
}
```

### `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';

@Module({
  controllers: [TradingController],
  providers: [TradingService],
})
export class AppModule {}
```

### `src/main.ts`

Standard bootstrap — see `templates/microservice-app.md`. Replace name with `Trading`.

### Config files

Copy `package.json`, `tsconfig.json`, `nest-cli.json`, `eslint.config.mjs` from `apps/service-core/`. Change package name to `@luckyplans/service-trading`.

## Step 3: Gateway Submodule

Create `apps/api-gateway/src/trading/`:

### `trading.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TradingResolver } from './trading.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRADING_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [TradingResolver],
})
export class TradingModule {}
```

### `trading.resolver.ts`

```typescript
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, ObjectType, Field, ID } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TradingMessagePattern } from '@luckyplans/shared';
import type { Trade, AuthUser } from '@luckyplans/shared';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ObjectType()
class TradeType {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  symbol!: string;

  @Field()
  side!: string;

  @Field(() => Int)
  quantity!: number;

  @Field()
  price!: number;

  @Field()
  executedAt!: Date;
}

@ObjectType()
class TradeResponse {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => TradeType, { nullable: true })
  data?: Trade;
}

@Resolver()
export class TradingResolver {
  constructor(@Inject('TRADING_SERVICE') private readonly tradingClient: ClientProxy) {}

  @UseGuards(SessionGuard)
  @Mutation(() => TradeResponse)
  async executeTrade(
    @Args('symbol') symbol: string,
    @Args('side') side: string,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() user: AuthUser,
  ): Promise<TradeResponse> {
    return firstValueFrom(
      this.tradingClient.send(TradingMessagePattern.EXECUTE_TRADE, {
        userId: user.userId,
        symbol,
        side,
        quantity,
      }),
    );
  }
}
```

> **Note:** The `userId` comes from the authenticated session via `@CurrentUser()` — never accept it as a client argument. This prevents users from executing trades on behalf of others.

### Register in `apps/api-gateway/src/app.module.ts`

```typescript
import { TradingModule } from './trading/trading.module';
// Add TradingModule to imports array
```

## Step 4: Dockerfile

Copy `apps/service-core/Dockerfile` to `apps/service-trading/Dockerfile`. Replace all `service-core` → `service-trading`.

## Step 5: Helm

Create `infrastructure/helm/luckyplans/templates/service-trading/deployment.yaml` — copy from `service-core`, replace `service-core` → `service-trading` and `.Values.serviceCore` → `.Values.serviceTrading`.

Add to `values.yaml`:

```yaml
serviceTrading:
  image:
    repository: luckyplans/service-trading
    tag: latest
  replicas: 1
  resources:
    requests:
      memory: '128Mi'
      cpu: '100m'
    limits:
      memory: '256Mi'
      cpu: '200m'
  probes:
    liveness:
      initialDelaySeconds: 15
      periodSeconds: 20
      failureThreshold: 3
```

## Step 6: CI/CD

In `.github/workflows/docker-build.yml`, add `service-trading` to the matrix:

```yaml
matrix:
  service: [web, api-gateway, service-core, service-trading]
```
