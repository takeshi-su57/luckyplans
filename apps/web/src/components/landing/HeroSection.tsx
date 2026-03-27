import Image from 'next/image';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

import { GnsIcon } from '@/components/icons/protocols/GnsIcon';
import { GmxIcon } from '@/components/icons/protocols/GmxIcon';
import { AvntIcon } from '@/components/icons/protocols/AvntIcon';
import { EthereumIcon } from '@/components/icons/chains/EthereumIcon';
import { ArbitrumIcon } from '@/components/icons/chains/ArbitrumIcon';
import { BaseIcon } from '@/components/icons/chains/BaseIcon';
import { PolygonIcon } from '@/components/icons/chains/PolygonIcon';
import { MegaEthIcon } from '@/components/icons/chains/MegaEthIcon';
import { AGGREGATE_VOLUME, CHAIN_COUNT } from './data/protocols';

const chainPills = [
  { name: 'Arbitrum', Icon: ArbitrumIcon },
  { name: 'Base', Icon: BaseIcon },
  { name: 'Polygon', Icon: PolygonIcon },
  { name: 'MegaETH', Icon: MegaEthIcon },
  { name: 'Ethereum', Icon: EthereumIcon },
];

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-6 pb-20 pt-32 text-center md:pb-28 md:pt-40">
      <Image
        src="/brand.png"
        alt=""
        width={600}
        height={600}
        className="pointer-events-none absolute -right-32 -top-16 opacity-[0.04] md:-right-16 md:-top-8 md:opacity-[0.06]"
        aria-hidden="true"
        priority
      />
      <Image
        src="/brand.png"
        alt=""
        width={400}
        height={400}
        className="pointer-events-none absolute -bottom-24 -left-32 opacity-[0.03] md:-left-16 md:opacity-[0.05]"
        aria-hidden="true"
      />

      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-400/20 blur-2xl" />
          <Image
            src="/brand.png"
            alt="LuckyPlans"
            width={96}
            height={96}
            className="relative drop-shadow-lg"
            priority
          />
        </div>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e7e4] bg-[#fbfbfa] px-3 py-1 text-xs font-medium text-[#787774]">
        v0.1.0 &middot; Open Source &middot;
        <span className="inline-flex items-center gap-1.5">
          <GnsIcon size={14} /> GNS
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GmxIcon size={14} /> GMX
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AvntIcon size={14} /> AVNT
        </span>
      </span>

      <h1 className="mt-8 max-w-3xl text-4xl font-bold tracking-tight text-[#37352f] md:text-5xl lg:text-6xl">
        The analytics layer for perpetual DEX trading
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#787774] md:text-lg">
        Full leaderboard analytics and deterministic backtesting for algorithmic strategies across
        gTrade, GMX, and Avantis. Multi-chain. Verifiable. Open source.
      </p>

      <p className="mt-4 font-mono text-sm text-[#0f7b6c]">
        Tracking {AGGREGATE_VOLUME} in perp volume across {CHAIN_COUNT} chains
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/takeshi-su57/luckyplans"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#e8e7e4] px-6 py-3 text-sm font-medium text-[#37352f] transition-colors hover:border-[#e8e7e4] hover:text-[#37352f]"
        >
          <GitHubIcon size={18} />
          View on GitHub
        </a>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        {chainPills.map(({ name, Icon }) => (
          <span
            key={name}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e7e4] bg-white px-3 py-1 text-xs font-medium text-[#787774]"
          >
            <Icon size={14} />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
