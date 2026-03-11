import type { NextConfig } from 'next';
import nextra from 'nextra';

const withNextra = nextra({
  contentDirBasePath: '/docs',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luckyplans/shared', '@heroui/react', '@heroui/styles'],
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
  },
};

export default withNextra(nextConfig);
