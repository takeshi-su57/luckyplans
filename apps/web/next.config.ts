import type { NextConfig } from 'next';
import nextra from 'nextra';

const withNextra = nextra({
  contentDirBasePath: '/docs',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luckyplans/shared', '@heroui/react', '@heroui/styles'],
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async rewrites() {
    const gatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:3001';
    return [
      { source: '/auth/:path*', destination: `${gatewayUrl}/auth/:path*` },
      { source: '/graphql', destination: `${gatewayUrl}/graphql` },
    ];
  },
};

export default withNextra(nextConfig);
