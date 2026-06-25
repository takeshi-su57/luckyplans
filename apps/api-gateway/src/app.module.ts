import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { getEnvVar } from '@luckyplans/shared';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { WorkersModule } from './workers/workers.module';
import { UploadsModule } from './uploads/uploads.module';
import { BacktestModule } from './backtest/backtest.module';
import { EdgesInternalModule } from './edges-internal/edges-internal.module';
import { GraphqlSharedModule } from './graphql/graphql-shared.module';

export function createGraphqlOptions(
  nodeEnv = getEnvVar('NODE_ENV', 'development'),
): ApolloDriverConfig {
  const isProduction = nodeEnv === 'production';
  return {
    driver: ApolloDriver,
    autoSchemaFile: isProduction ? true : join(process.cwd(), 'schema.graphql'),
    playground: !isProduction,
    introspection: !isProduction,
    context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
  };
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(createGraphqlOptions()),
    HealthModule,
    GraphqlSharedModule,
    AuthModule,
    ProfileModule,
    WorkersModule,
    UploadsModule,
    BacktestModule,
    EdgesInternalModule,
  ],
})
export class AppModule {}
