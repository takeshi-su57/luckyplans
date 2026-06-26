import type { NextConfig } from 'next';
import { resolveApiGatewayUrl } from './src/config/api-gateway-url';
import { resolveBlogUrl, resolveDocsUrl } from './src/config/public-site-urls';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luckyplans/shared', '@heroui/react', '@heroui/styles'],
  output: 'standalone',
  async redirects() {
    const docsUrl = resolveDocsUrl(process.env);
    const blogUrl = resolveBlogUrl(process.env);

    return [
      {
        source: '/docs',
        destination: docsUrl,
        permanent: true,
      },
      {
        source: '/docs/:path*',
        destination: `${docsUrl}/:path*`,
        permanent: true,
      },
      {
        source: '/blog',
        destination: blogUrl,
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: `${blogUrl}/:path*`,
        permanent: true,
      },
    ];
  },
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

export default nextConfig;
