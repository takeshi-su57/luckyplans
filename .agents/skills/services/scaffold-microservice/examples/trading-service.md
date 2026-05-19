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
    // Complex trading logic: order matching, risk checks, portfolio updates.
    const trade: Trade = {
      id: generateId(),
      ...dto,
      price: 100.0, // placeholder: real price comes from matching engine
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
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
import { TraceContextExtractor, getEnvVar } from '@luckyplans/shared';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: getEnvVar('LOG_LEVEL', 'info'),
        transport:
          getEnvVar('NODE_ENV', 'development') !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        mixin: () => {
          const span = trace.getActiveSpan();
          if (!span) return {};
          const ctx = span.spanContext();
          return { traceId: ctx.traceId, spanId: ctx.spanId };
        },
      },
    }),
  ],
  controllers: [TradingController],
  providers: [
    TradingService,
    { provide: APP_INTERCEPTOR, useClass: TraceContextExtractor },
  ],
})
export class AppModule {}
```

### `src/main.ts`

Standard bootstrap: see `templates/microservice-app.md` and replace service name with `service-trading`.

### Config files

Copy `package.json`, `tsconfig.json`, `nest-cli.json`, `eslint.config.mjs` from `apps/service-core/`. Change package name to `@luckyplans/service-trading`.

## Step 3: Gateway Integration (Separate Skill)

This skill does not scaffold gateway modules.

Use `create-gateway-module` to expose `service-trading` through `apps/api-gateway`.

## Step 4: Dockerfile

Copy `apps/service-core/Dockerfile` to `apps/service-trading/Dockerfile`. Replace all `service-core` with `service-trading`.

## Step 5: Helm

Create `infrastructure/helm/luckyplans/templates/service-trading/deployment.yaml`: copy from `service-core`, replace `service-core` with `service-trading` and `.Values.serviceCore` with `.Values.serviceTrading`.

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

In `.github/workflows/docker-build.yml`, add `service-trading` to `strategy.matrix.include`:

```yaml
matrix:
  include:
    - service: service-trading
      dockerfile: apps/service-trading/Dockerfile
```

In `.github/workflows/update-tags.yml`, update tags in `infrastructure/helm/luckyplans/values.prod.yaml`:

```bash
yq -i ".serviceTrading.image.tag = \"$TAG\"" "infrastructure/helm/luckyplans/values.prod.yaml"
```

## Step 7: ArgoCD

Update the ArgoCD application manifest used by this repository (for example `infrastructure/argocd/apps/luckyplans-prod.yaml`) so the Helm release including `service-trading` is synchronized in the target environment(s).
