export function resolveApiGatewayUrl(env: NodeJS.ProcessEnv): string {
  if (env.API_GATEWAY_URL) return env.API_GATEWAY_URL;

  return env.NODE_ENV === 'production' ? 'https://api.luckyplans.xyz' : 'http://localhost:3001';
}
