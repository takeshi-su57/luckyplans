import type { SVGProps } from '@/components/icons/types';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import {
  ArbitrumIcon,
  BaseIcon,
  EthereumIcon,
  MegaEthIcon,
  PolygonIcon,
} from '@/components/icons/chains';
import { AvntIcon, GmxIcon, GnsIcon } from '@/components/icons/protocols';
import { chains, protocols } from './data/protocols';

const protocolIcons: Record<string, (props: SVGProps) => React.ReactNode> = {
  gns: GnsIcon,
  gmx: GmxIcon,
  avnt: AvntIcon,
};

const chainIcons: Record<string, (props: SVGProps) => React.ReactNode> = {
  ethereum: EthereumIcon,
  arbitrum: ArbitrumIcon,
  base: BaseIcon,
  polygon: PolygonIcon,
  megaeth: MegaEthIcon,
};

const docsUrl = import.meta.env.VITE_DOCS_URL || 'https://app.luckyplans.xyz/docs';
const blogUrl = `${docsUrl.replace(/\/docs\/?$/, '')}/blog`;

export function Footer() {
  return (
    <footer className="border-t border-[#e8e7e4] bg-[#fbfbfa]">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/brand.png" alt="LuckyPlans" width={24} height={24} />
              <p className="text-sm font-semibold text-[#37352f]">
                Lucky<span className="text-[#0f7b6c]">Plans</span>
              </p>
            </div>
            <p className="mt-1 text-xs text-[#787774]">
              Perp DEX Analytics &amp; Backtesting Infrastructure
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#a3a29e]">
              Protocols
            </h4>
            <ul className="mt-3 space-y-2">
              {protocols.map((protocol) => {
                const Icon = protocolIcons[protocol.id];
                return (
                  <li key={protocol.id}>
                    <a
                      href={protocol.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                    >
                      {Icon && <Icon size={14} />}
                      {protocol.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#a3a29e]">Chains</h4>
            <ul className="mt-3 space-y-2">
              {chains.map((chain) => {
                const Icon = chainIcons[chain.id];
                return (
                  <li key={chain.id}>
                    <a
                      href={chain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                    >
                      {Icon && <Icon size={14} />}
                      {chain.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#a3a29e]">
              Project
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://github.com/takeshi-su57/luckyplans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                >
                  <GitHubIcon size={14} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={blogUrl}
                  className="text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                >
                  Lab Notes
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#proof"
                  className="text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                >
                  Artifacts
                </a>
              </li>
              <li>
                <a
                  href={docsUrl}
                  className="text-sm text-[#787774] transition-colors hover:text-[#37352f]"
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#e8e7e4] pt-6 text-center text-xs text-[#a3a29e]">
          MIT License · 2026
        </div>
      </div>
    </footer>
  );
}
