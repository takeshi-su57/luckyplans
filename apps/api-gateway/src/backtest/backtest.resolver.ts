import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { SessionGuard } from '../auth/session.guard';
import { RealtimeEventsService } from '../graphql/realtime-events.service';
import { BacktestService } from './backtest.service';

@ObjectType()
class StrategyTemplate {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String)
  factoryConfig!: unknown;

  @Field(() => Boolean)
  isActive!: boolean;
}

@ObjectType()
class BacktestTask {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  symbol!: string;

  @Field(() => String)
  interval!: string;

  @Field(() => String)
  status!: string;

  @Field(() => String, { nullable: true })
  assignedWorkerId?: string;

  @Field(() => Int, { nullable: true })
  processedConfigs?: number;

  @Field(() => Int, { nullable: true })
  totalConfigs?: number;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
class BacktestResult {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  configId!: string;

  @Field(() => String)
  metrics!: unknown;

  @Field(() => Date)
  createdAt!: Date;
}

@InputType()
class CreateStrategyTemplateInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String)
  factoryConfig!: unknown;
}

@InputType()
class UpdateStrategyTemplateInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  factoryConfig?: unknown;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
class CreateBacktestTaskInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  symbol!: string;

  @Field(() => String)
  interval!: string;

  @Field(() => String)
  assignedWorkerId!: string;

  @Field(() => String)
  searchStrategy!: string;

  @Field(() => ID, { nullable: true })
  strategyTemplateId?: string;
}

@InputType()
class BacktestResultsOptionsInput {
  @Field(() => String, { nullable: true })
  sort?: 'createdAt' | 'totalPnlPercent';

  @Field(() => String, { nullable: true })
  order?: 'asc' | 'desc';

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

@Resolver()
export class BacktestResolver {
  constructor(
    private readonly backtestService: BacktestService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  @Mutation(() => StrategyTemplate)
  @UseGuards(SessionGuard)
  async createStrategyTemplate(
    @Args('input') input: CreateStrategyTemplateInput,
  ): Promise<StrategyTemplate> {
    return this.backtestService.createStrategyTemplate(input);
  }

  @Mutation(() => StrategyTemplate)
  @UseGuards(SessionGuard)
  async updateStrategyTemplate(
    @Args('input') input: UpdateStrategyTemplateInput,
  ): Promise<StrategyTemplate> {
    return this.backtestService.updateStrategyTemplate(input);
  }

  @Mutation(() => BacktestTask)
  @UseGuards(SessionGuard)
  async createBacktestTask(@Args('input') input: CreateBacktestTaskInput): Promise<BacktestTask> {
    const created = await this.backtestService.createBacktestTask(input);
    await this.realtimeEvents.publishBacktestTaskUpdated(created);
    return created;
  }

  @Mutation(() => BacktestTask)
  @UseGuards(SessionGuard)
  async cancelBacktestTask(@Args('taskId') taskId: string): Promise<BacktestTask> {
    const updated = await this.backtestService.cancelBacktestTask(taskId);
    await this.realtimeEvents.publishBacktestTaskUpdated(updated);
    return updated;
  }

  @Mutation(() => BacktestTask)
  @UseGuards(SessionGuard)
  async retryBacktestTask(@Args('taskId') taskId: string): Promise<BacktestTask> {
    const updated = await this.backtestService.retryBacktestTask(taskId);
    await this.realtimeEvents.publishBacktestTaskUpdated(updated);
    return updated;
  }

  @Query(() => [BacktestTask])
  @UseGuards(SessionGuard)
  async backtestTasks(): Promise<BacktestTask[]> {
    return this.backtestService.listBacktestTasks();
  }

  @Query(() => BacktestTask, { nullable: true })
  @UseGuards(SessionGuard)
  async backtestTask(@Args('id') id: string): Promise<BacktestTask | null> {
    return this.backtestService.getBacktestTask(id);
  }

  @Query(() => [BacktestResult])
  @UseGuards(SessionGuard)
  async backtestResults(
    @Args('taskId') taskId: string,
    @Args('options', { nullable: true }) options?: BacktestResultsOptionsInput,
  ): Promise<BacktestResult[]> {
    return this.backtestService.listBacktestResults(taskId, options);
  }

  @Subscription(() => BacktestTask)
  backtestTaskUpdated() {
    return this.realtimeEvents.backtestTaskUpdatedIterator();
  }

  @Subscription(() => BacktestResult)
  backtestResultCreated() {
    return this.realtimeEvents.backtestResultCreatedIterator();
  }
}
