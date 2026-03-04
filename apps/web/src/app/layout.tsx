import type { Metadata } from 'next';
import { ApolloWrapper } from '@/lib/apollo-provider';

export const metadata: Metadata = {
  title: 'LuckyPlans',
  description: 'LuckyPlans Client Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
