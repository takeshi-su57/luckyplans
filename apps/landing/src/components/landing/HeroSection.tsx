import { BarChart3, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';
import { HeroProductVisual } from './ProductVisuals';

const productAreas = [
  { label: 'Simulation-first workflow', Icon: Waypoints },
  { label: 'Risk-aware review', Icon: ShieldCheck },
  { label: 'Performance evidence', Icon: BarChart3 },
];
const docsUrl = 'https://docs.luckyplans.xyz';
const appUrl = 'https://app.luckyplans.xyz';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_bottom_left,rgba(112,64,255,0.22),transparent_20%),radial-gradient(circle_at_top_right,rgba(45,99,226,0.26),transparent_26%),linear-gradient(135deg,#0d1328_0%,#121938_52%,#182142_100%)] text-white">
      <div className="lp-drift absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-[#6b4dff]/20 blur-3xl" />
      <div className="lp-drift absolute right-0 top-0 h-80 w-80 rounded-full bg-[#2d63e2]/18 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-18 md:px-8 md:pb-28 md:pt-22 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm font-medium text-[#d6def7] backdrop-blur-sm">
            <Sparkles size={14} className="text-[#78a2ff]" />
            Live product workflows, not marketing abstractions
          </div>

          <div className="mt-8 font-mono text-sm tracking-[0.22em] text-[#cfd8f7] uppercase">
            Trade Console
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-[0.94] tracking-tight md:text-7xl">
            Simulate copy-trading plans before risking capital.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c4d0ef] md:text-[20px] md:leading-9">
            Turn trader histories into structured simulation plans, review follower risk, and make
            execution decisions with real metrics instead of blind copy.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#2d63e2] px-7 py-4 text-base font-semibold text-white shadow-[0_12px_34px_rgba(45,99,226,0.32)] transition-transform hover:-translate-y-0.5"
            >
              Open App
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/16"
            >
              Docs
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {productAreas.map(({ label, Icon }) => (
              <div
                key={label}
                className="lp-glass rounded-[22px] border border-white/10 px-4 py-4 text-[#e8eeff] lp-surface"
              >
                <Icon size={18} className="text-[#78a2ff]" />
                <div className="mt-3 text-sm font-semibold leading-6">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#aebcde]">
            <span>Auto Simulations</span>
            <span>Leaderboard Analysis</span>
            <span>Follower PnL Metrics</span>
          </div>
        </div>

        <div className="relative">
          <div className="lp-float absolute -left-4 top-8 h-24 w-24 rounded-full bg-[#7f35d8]/18 blur-2xl" />
          <div className="lp-float-delayed absolute right-10 top-0 h-28 w-28 rounded-full bg-[#2d63e2]/20 blur-2xl" />
          <HeroProductVisual />
        </div>
      </div>
    </section>
  );
}
