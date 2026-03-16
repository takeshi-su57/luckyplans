import { bootstrapTelemetry } from '@luckyplans/shared';

export const otelSdk = bootstrapTelemetry({
  serviceName: 'service-core',
});
