import type { NextConfig } from 'next';
import nextra from 'nextra';
import { resolveApiGatewayUrl } from './src/config/api-gateway-url';

const withNextra = nextra({
  contentDirBasePath: '/docs',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luckyplans/shared', '@heroui/react', '@heroui/styles'],
  output: 'standalone',
  async rewrites() {
    const gatewayUrl = resolveApiGatewayUrl(process.env);
    return [
      { source: '/auth/:path*', destination: `${gatewayUrl}/auth/:path*` },
      { source: '/graphql', destination: `${gatewayUrl}/graphql` },
      { source: '/uploads', destination: `${gatewayUrl}/uploads` },
      { source: '/uploads/:path*', destination: `${gatewayUrl}/uploads/:path*` },
    ];
  },
};

export default withNextra(nextConfig);
