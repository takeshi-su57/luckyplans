import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
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
