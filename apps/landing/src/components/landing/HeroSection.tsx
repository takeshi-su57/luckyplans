import { ArrowUpRight, BarChart3, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';

const productAreas = [
  {
    label: 'Simulation-first workflow',
    description: 'Convert trader history into reviewable plans before any live exposure.',
    Icon: Waypoints,
  },
  {
    label: 'Risk-aware review',
    description: 'Inspect drawdowns, follower exposure, and execution context in one surface.',
    Icon: ShieldCheck,
  },
  {
    label: 'Performance evidence',
    description: 'Use leaderboard-grade metrics instead of intuition and selective screenshots.',
    Icon: BarChart3,
  },
];
const proofPoints = ['Auto Simulations', 'Leaderboard Analysis', 'Follower PnL Metrics'];
const docsUrl = 'https://docs.luckyplans.xyz';
const appUrl = 'https://app.luckyplans.xyz';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#07111f_0%,#091527_58%,#0b1826_100%)] text-white">
      <div className="absolute inset-0">
        <img
          src="/hero-market-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-24"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(35,208,90,0.14),transparent_18%),radial-gradient(circle_at_84%_14%,rgba(241,182,57,0.14),transparent_20%),linear-gradient(180deg,rgba(5,12,23,0.18)_0%,rgba(5,12,23,0.86)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-345 flex-col justify-center px-6 py-16 md:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(560px,1fr)] xl:gap-14">
          <div className="max-w-162.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-[#dce7ff] backdrop-blur-sm">
              <Sparkles size={13} className="text-[#43d86d]" />
              Live product workflows, not marketing abstractions
            </div>

            <div className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#86b7ff]">
              Trade Console
            </div>

            <h1 className="mt-4 max-w-180 text-[3.25rem] font-bold leading-[0.94] tracking-[-0.06em] md:text-[3rem] xl:text-[3.5rem]">
              Simulate copy-trading plans before risking capital.
            </h1>

            <p className="mt-5 max-w-156 text-[16px] leading-8 text-[#b7c6dd] md:text-[18px]">
              Turn trader histories into structured simulation plans, review follower risk, and make
              execution decisions with real metrics instead of blind copy.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#1fd45f_0%,#14b84f_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(31,212,95,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Open App
                <ArrowUpRight size={16} />
              </a>
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/14 bg-white/7 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
              >
                Docs
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#9fb0c8]">
              {proofPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#31d866]" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div aria-label="hero product preview" className="relative mx-auto w-full max-w-180">
            <div className="absolute -inset-8 rounded-full bg-[#18d66a]/12 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,25,34,0.9)_0%,rgba(9,13,20,0.98)_100%)] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.46)] md:rounded-[34px]">
              <div className="overflow-hidden rounded-[20px] border border-white/7 bg-[#03060a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <img
                  src="/hero-dashboard-shot.png"
                  alt="LuckyPlans simulation dashboard preview"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="mx-auto mt-3 h-3 w-[26%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.035)_100%)]" />
              <div className="mx-auto h-3.5 w-[12%] rounded-b-3xl bg-[linear-gradient(180deg,rgba(48,57,70,0.92)_0%,rgba(20,24,31,0.98)_100%)]" />
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {productAreas.map(({ label, description, Icon }) => (
            <div
              key={label}
              className="group rounded-[22px] border border-white/9 bg-white/4.5 p-4 backdrop-blur-md transition-colors hover:bg-white/6.5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#092413] text-[#3ada70] shadow-[inset_0_0_0_1px_rgba(58,218,112,0.12)]">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#ecf3ff]">{label}</div>
                  <p className="mt-1.5 text-[13px] leading-6 text-[#9bacc3]">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 hidden grid-cols-3 gap-3 lg:grid">
          {[
            ['Net PnL', '$471.80', '+12.64%'],
            ['Trades', '563', '+8.21%'],
            ['Profit Factor', '1.07', '+8.31%'],
          ].map(([label, value, change]) => (
            <div
              key={label}
              className="rounded-[18px] border border-white/8 bg-black/18 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8194ad]">
                    {label}
                  </div>
                  <div className="mt-1 font-mono text-[20px] font-semibold text-[#ecf3ff]">
                    {value}
                  </div>
                </div>
                <div className="rounded-full bg-[#0c2d17] px-2.5 py-1 text-xs font-semibold text-[#45db79]">
                  {change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
