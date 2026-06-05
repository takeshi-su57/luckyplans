import { describe, expect, it } from 'vitest';
import { resolveApiGatewayUrl } from './api-gateway-url';

describe('resolveApiGatewayUrl', () => {
  it('uses explicit API_GATEWAY_URL when provided', () => {
    expect(
      resolveApiGatewayUrl({
        API_GATEWAY_URL: 'https://api.custom.example',
        NODE_ENV: 'production',
      }),
    ).toBe('https://api.custom.example');
  });

  it('defaults to production API host in production', () => {
    expect(
      resolveApiGatewayUrl({
        NODE_ENV: 'production',
      }),
    ).toBe('https://api.luckyplans.xyz');
  });

  it('defaults to local gateway in non-production', () => {
    expect(
      resolveApiGatewayUrl({
        NODE_ENV: 'development',
      }),
    ).toBe('http://localhost:3001');
  });
});
