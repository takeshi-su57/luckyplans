'use client';

import { RouterProvider } from '@heroui/react';
import { ApolloWrapper } from '@/lib/apollo/provider';
import { QueryProvider } from '@/lib/query/provider';
import { useRouter } from 'next/navigation';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <QueryProvider>
      <ApolloWrapper>
        <RouterProvider navigate={(href) => router.push(href)}>
          {children}
        </RouterProvider>
      </ApolloWrapper>
    </QueryProvider>
  );
}
