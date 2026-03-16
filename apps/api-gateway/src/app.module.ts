import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.graphql'),
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    HealthModule,
    AuthModule,
    CoreModule,
  ],
})
export class AppModule {}
