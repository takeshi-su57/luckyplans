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
} from '@nestjs/graphql';
import { BacktestService } from './backtest.service';

@ObjectType()
class StrategyTemplate {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => String)
  factoryConfig!: unknown;

  @Field()
  isActive!: boolean;
}

@ObjectType()
class BacktestTask {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  symbol!: string;

  @Field()
  interval!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  assignedWorkerId?: string;

  @Field(() => Int, { nullable: true })
  processedConfigs?: number;

  @Field(() => Int, { nullable: true })
  totalConfigs?: number;

  @Field()
  createdAt!: Date;
}

@ObjectType()
class BacktestResult {
  @Field(() => ID)
  id!: string;

  @Field()
  configId!: string;

  @Field(() => String)
  metrics!: unknown;

  @Field()
  createdAt!: Date;
}

@InputType()
class CreateStrategyTemplateInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => String)
  factoryConfig!: unknown;
}

@InputType()
class UpdateStrategyTemplateInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  factoryConfig?: unknown;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
class CreateBacktestTaskInput {
  @Field()
  name!: string;

  @Field()
  symbol!: string;

  @Field()
  interval!: string;

  @Field()
  assignedWorkerId!: string;

  @Field()
  searchStrategy!: string;

  @Field(() => ID, { nullable: true })
  strategyTemplateId?: string;
}

@InputType()
class BacktestResultsOptionsInput {
  @Field({ nullable: true })
  sort?: 'createdAt' | 'totalPnlPercent';

  @Field({ nullable: true })
  order?: 'asc' | 'desc';

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

@Resolver()
export class BacktestResolver {
  constructor(private readonly backtestService: BacktestService) {}

  @Mutation(() => StrategyTemplate)
  async createStrategyTemplate(
    @Args('input') input: CreateStrategyTemplateInput,
  ): Promise<StrategyTemplate> {
    return this.backtestService.createStrategyTemplate(input);
  }

  @Mutation(() => StrategyTemplate)
  async updateStrategyTemplate(
    @Args('input') input: UpdateStrategyTemplateInput,
  ): Promise<StrategyTemplate> {
    return this.backtestService.updateStrategyTemplate(input);
  }

  @Mutation(() => BacktestTask)
  async createBacktestTask(@Args('input') input: CreateBacktestTaskInput): Promise<BacktestTask> {
    return this.backtestService.createBacktestTask(input);
  }

  @Mutation(() => BacktestTask)
  async cancelBacktestTask(@Args('taskId') taskId: string): Promise<BacktestTask> {
    return this.backtestService.cancelBacktestTask(taskId);
  }

  @Mutation(() => BacktestTask)
  async retryBacktestTask(@Args('taskId') taskId: string): Promise<BacktestTask> {
    return this.backtestService.retryBacktestTask(taskId);
  }

  @Query(() => [BacktestTask])
  async backtestTasks(): Promise<BacktestTask[]> {
    return this.backtestService.listBacktestTasks();
  }

  @Query(() => BacktestTask, { nullable: true })
  async backtestTask(@Args('id') id: string): Promise<BacktestTask | null> {
    return this.backtestService.getBacktestTask(id);
  }

  @Query(() => [BacktestResult])
  async backtestResults(
    @Args('taskId') taskId: string,
    @Args('options', { nullable: true }) options?: BacktestResultsOptionsInput,
  ): Promise<BacktestResult[]> {
    return this.backtestService.listBacktestResults(taskId, options);
  }
}
