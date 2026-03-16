import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { context, trace, propagation, SpanKind, ROOT_CONTEXT } from '@opentelemetry/api';

/**
 * Injects W3C trace context into the outgoing Redis message payload.
 * Use on the gateway side (add to resolver providers or as a global interceptor).
 */
@Injectable()
export class TraceContextInjector implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Nothing to do here for HTTP/GraphQL — trace context is injected via
    // the helper function below when calling ClientProxy.send().
    return next.handle();
  }
}

/**
 * Extracts W3C trace context from an incoming Redis message payload
 * and creates a child span for the microservice handler.
 * Use on the microservice side as a global interceptor.
 */
@Injectable()
export class TraceContextExtractor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const rpcContext = ctx.switchToRpc();
    const data = rpcContext.getData();
    const pattern = ctx.getHandler().name;

    if (data && typeof data === 'object' && '__traceContext' in data) {
      const carrier = data.__traceContext as Record<string, string>;
      delete data.__traceContext;

      const extractedContext = propagation.extract(ROOT_CONTEXT, carrier);
      const tracer = trace.getTracer('luckyplans-microservice');
      const span = tracer.startSpan(
        `microservice.${pattern}`,
        { kind: SpanKind.CONSUMER },
        extractedContext,
      );

      return new Observable((subscriber) => {
        context.with(trace.setSpan(extractedContext, span), () => {
          next.handle().subscribe({
            next: (val) => subscriber.next(val),
            error: (err) => {
              span.recordException(err as Error);
              span.end();
              subscriber.error(err);
            },
            complete: () => {
              span.end();
              subscriber.complete();
            },
          });
        });
      });
    }

    return next.handle();
  }
}

/**
 * Injects W3C trace context into a message payload before sending via ClientProxy.
 * Call this to wrap the payload before passing to `clientProxy.send(pattern, payload)`.
 *
 * @example
 * ```ts
 * const payload = injectTraceContext({ page: 1, limit: 10 });
 * return firstValueFrom(this.coreClient.send(CoreMessagePattern.GET_ITEMS, payload));
 * ```
 */
export function injectTraceContext<T extends Record<string, unknown>>(payload: T): T {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);

  if (Object.keys(carrier).length > 0) {
    return { ...payload, __traceContext: carrier };
  }
  return payload;
}
