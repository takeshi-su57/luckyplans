# Example: Add "Order" Module to service-core

Adds order handling as a sub-module within the existing `service-core` microservice.

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

Directory: `apps/service-core/src/order/`

### `order.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
```

### `order.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { generateId } from '@luckyplans/shared';
import type { Order, CreateOrderDto, ServiceResponse } from '@luckyplans/shared';

@Injectable()
export class OrderService {
  private orders: Order[] = [];

  async getOrders(userId: string, page: number, limit: number) {
    const userOrders = this.orders.filter((o) => o.userId === userId);
    const start = (page - 1) * limit;
    return {
      items: userOrders.slice(start, start + limit),
      total: userOrders.length,
    };
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async createOrder(dto: CreateOrderDto): Promise<ServiceResponse<Order>> {
    const order: Order = {
      id: generateId(),
      ...dto,
      status: 'pending',
      createdAt: new Date(),
    };
    this.orders.push(order);
    return { success: true, data: order, message: 'Order created' };
  }
}
```

### `order.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoreMessagePattern } from '@luckyplans/shared';
import type { CreateOrderDto } from '@luckyplans/shared';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(CoreMessagePattern.GET_ORDERS)
  async getOrders(@Payload() data: { userId: string; page: number; limit: number }) {
    return this.orderService.getOrders(data.userId, data.page, data.limit);
  }

  @MessagePattern(CoreMessagePattern.GET_ORDER)
  async getOrder(@Payload() data: { id: string }) {
    return this.orderService.getOrder(data.id);
  }

  @MessagePattern(CoreMessagePattern.CREATE_ORDER)
  async createOrder(@Payload() data: CreateOrderDto) {
    return this.orderService.createOrder(data);
  }
}
```

## Step 3: Register

In `apps/service-core/src/app.module.ts`:

```typescript
import { OrderModule } from './order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class AppModule {}
```
