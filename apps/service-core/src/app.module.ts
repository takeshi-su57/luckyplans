import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
import { TraceContextExtractor } from '@luckyplans/shared';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { PrismaService } from './prisma.service';

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
  ],
  controllers: [CoreController],
  providers: [
    PrismaService,
    CoreService,
    { provide: APP_INTERCEPTOR, useClass: TraceContextExtractor },
  ],
})
export class AppModule {}
