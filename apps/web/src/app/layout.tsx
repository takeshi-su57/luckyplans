import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  icons: {
    icon: '/logo.ico',
  },
  title: {
    default: 'LuckyPlans | Perpetual DEX Analytics & Backtesting Infrastructure',
    template: '%s | LuckyPlans',
  },
  description:
    'Unified analytics across $552B+ in perpetual DEX volume. Leaderboards and deterministic backtesting for gTrade (GNS), GMX, and Avantis (AVNT) on Arbitrum, Base, Polygon, MegaETH, and Ethereum. Open source.',
  keywords: [
    'perpetual DEX',
    'perp trading',
    'gTrade',
    'GNS',
    'Gains Network',
    'GMX',
    'Avantis',
    'AVNT',
    'leaderboard',
    'backtesting engine',
    'algorithmic trading',
    'DeFi infrastructure',
    'DeFi analytics',
    'perpetual futures',
    'Arbitrum',
    'Base',
    'Polygon',
    'MegaETH',
    'Ethereum',
    'EVM',
    'multi-chain',
    'on-chain verification',
    'perp DEX leaderboard',
    'copy trading',
    'open source',
  ],
  authors: [{ name: 'LuckyPlans' }],
  creator: 'LuckyPlans',
  openGraph: {
    title: 'LuckyPlans | Simulation-first copy-trading research',
    description:
      'Simulate copy-trading plans, inspect trader risk, and review deterministic backtesting results before risking capital.',
    url: 'https://luckyplans.xyz',
    siteName: 'LuckyPlans',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LuckyPlans simulation-first copy-trading research preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuckyPlans | Simulation-first copy-trading research',
    description:
      'Simulate copy-trading plans, inspect trader risk, and review deterministic backtesting results before risking capital.',
    images: ['https://luckyplans.xyz/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'base:app_id': '69fb65b56e900aabdc5abadb',
  },
  metadataBase: new URL('https://luckyplans.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
