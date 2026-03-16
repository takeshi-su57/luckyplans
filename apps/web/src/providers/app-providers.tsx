'use client';

import dynamic from 'next/dynamic';

// All providers (Apollo, React Query, HeroUI Router) use React hooks internally.
// Next.js 16 static prerendering fails when hooks run during page generation.
// Load the entire provider tree client-side only to avoid prerendering crashes.
const AppProvidersInner = dynamic(
  () => import('./app-providers-inner').then((m) => m.AppProvidersInner),
  { ssr: false },
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppProvidersInner>{children}</AppProvidersInner>;
}
