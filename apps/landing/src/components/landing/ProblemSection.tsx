import {
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { ProblemVisual } from './ProductVisuals';
import { SolutionVisual } from './ProductVisuals';

const problemCards = [
  {
    title: 'Noisy histories',
    body: 'Hard to compare trader behavior across scattered views.',
    icon: TrendingUp,
  },
  {
    title: 'Hidden drawdowns',
    body: 'PnL curves can recover after deep risk exposure.',
    icon: TrendingDown,
  },
  {
    title: 'No plan validation',
    body: 'Copy logic should be tested before live execution.',
    icon: TriangleAlert,
  },
] as const;

const solutionSteps = [
  {
    step: '01',
    title: 'Select trader',
    body: 'Pick a trader and set the period and leader selection.',
    icon: UserRound,
    tone: 'green',
  },
  {
    step: '02',
    title: 'Generate plans',
    body: 'Auto-generate multiple plans with different rules and settings.',
    icon: Sparkles,
    tone: 'purple',
  },
  {
    step: '03',
    title: 'Review risk',
    body: 'Compare simulations, metrics, and risk before you copy.',
    icon: ShieldCheck,
    tone: 'blue',
  },
] as const;

function RiskCard({ item }: { item: (typeof problemCards)[number] }) {
  const Icon = item.icon;

  return (
    <div className="rounded-[18px] border border-[#dfe8f7] bg-white/86 p-4 shadow-[0_16px_40px_rgba(34,58,116,0.08)] backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff0f0] text-[#ef2f2f]">
          <Icon aria-hidden="true" size={28} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-[15px] font-bold text-[#121a31]">{item.title}</div>
          <p className="mt-1 text-[13px] leading-5 text-[#526180]">{item.body}</p>
        </div>
      </div>
    </div>
  );
}

function SolutionStep({ item }: { item: (typeof solutionSteps)[number] }) {
  const Icon = item.icon;
  const toneClasses = {
    green: {
      number: 'text-[#04a85e]',
      icon: 'bg-[#e6f8ee] text-[#04a85e]',
    },
    purple: {
      number: 'text-[#8538e2]',
      icon: 'bg-[#f0e4ff] text-[#8538e2]',
    },
    blue: {
      number: 'text-[#2563eb]',
      icon: 'bg-[#e9f1ff] text-[#2563eb]',
    },
  }[item.tone];

  return (
    <div className="grid grid-cols-[48px_1fr] gap-4">
      <div className="relative flex justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5e2f4] bg-white text-[16px] font-bold shadow-[0_10px_24px_rgba(38,74,146,0.08)]">
          <span className={toneClasses.number}>{item.step}</span>
        </div>
      </div>
      <div className="rounded-[18px] border border-[#dfe8f7] bg-white/88 p-4 shadow-[0_16px_40px_rgba(34,58,116,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${toneClasses.icon}`}
          >
            <Icon aria-hidden="true" size={27} strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#121a31]">{item.title}</div>
            <p className="mt-1 text-[13px] leading-5 text-[#526180]">{item.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section
      id="problem"
      aria-label="problem and solution preview"
      className="relative isolate bg-[#f4f8fe] px-4 py-16 md:px-8 lg:py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(45,99,226,0.10),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(31,212,95,0.08),transparent_28%)]" />
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(135deg,#f9fcff_0%,#eff6ff_48%,#f7fbff_100%)] px-6 py-12 shadow-[0_28px_90px_rgba(35,68,132,0.10)] md:px-10 lg:px-12">
        <div className="grid gap-10 xl:grid-cols-2 xl:gap-12">
          <div>
            <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="pt-6">
                <div className="text-[14px] font-bold uppercase tracking-[0.02em] text-[#2563eb]">
                  The problem
                </div>
                <h2 className="mt-6 max-w-[360px] text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-[#0b1530] md:text-[48px]">
                  Blind copy trading hides risk.
                </h2>
                <p className="mt-6 max-w-[420px] text-[17px] leading-8 text-[#425373]">
                  A trader can look profitable while drawdown, timing, leverage, and execution
                  details tell a different story.
                </p>
              </div>

              <div className="space-y-3">
                {problemCards.map((item) => (
                  <RiskCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-3 md:mt-4">
              <ProblemVisual />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-6 hidden h-[300px] w-px bg-white lg:block" />
            <div className="grid gap-7 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div className="pt-6">
                <div className="text-[14px] font-bold uppercase tracking-[0.02em] text-[#00a95a]">
                  The solution
                </div>
                <h2 className="mt-6 max-w-[360px] text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-[#0b1530] md:text-[48px]">
                  Plan, simulate, then decide.
                </h2>
                <p className="mt-6 max-w-[390px] text-[17px] leading-8 text-[#425373]">
                  LuckyPlans organizes copy-trading research into simulations, plans, metrics, and
                  reviewable results.
                </p>
              </div>

              <div className="relative space-y-4">
                <div className="absolute left-5 top-8 hidden h-[230px] w-px bg-[#d5e0ef] sm:block" />
                {solutionSteps.map((item) => (
                  <SolutionStep key={item.step} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-3 md:mt-4">
              <SolutionVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
