import {
  BarChart3,
  ChartNoAxesCombined,
  Database,
  LockKeyhole,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from 'lucide-react';

const featureCards = [
  {
    title: 'Simulation first',
    body: 'Test before you copy.',
    Icon: Target,
    className: 'bg-[#123fbd] text-[#9ec0ff]',
  },
  {
    title: 'Risk aware',
    body: 'Understand risk and drawdown.',
    Icon: ShieldCheck,
    className: 'bg-[#11673e] text-[#98f1bd]',
  },
  {
    title: 'Data driven',
    body: 'Real trades, real outcomes.',
    Icon: Zap,
    className: 'bg-[#4d1b8e] text-[#d3a4ff]',
  },
  {
    title: 'Built for security',
    body: 'You stay in control.',
    Icon: LockKeyhole,
    className: 'bg-[#805319] text-[#ffd37d]',
  },
];

const valueCards = [
  {
    title: 'Real platform data',
    body: 'Normalized across multi-platforms & chains',
    Icon: Database,
    className: 'text-[#4778ff]',
  },
  {
    title: 'Deterministic engine',
    body: 'Reproducible simulations you can trust',
    Icon: ChartNoAxesCombined,
    className: 'text-[#20d17e]',
  },
  {
    title: 'Metrics that matter',
    body: 'PnL, drawdown, trades, win rate, profit factor',
    Icon: BarChart3,
    className: 'text-[#ffb02e]',
  },
  {
    title: 'For traders & builders',
    body: 'Research, validate, and execute with clarity',
    Icon: Users,
    className: 'text-[#4778ff]',
  },
];

export function LabNotesSection() {
  return (
    <section className="relative overflow-hidden bg-[#041027] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(61,118,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(61,118,255,0.055)_1px,transparent_1px)] bg-size-[72px_72px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(46,236,126,0.22),transparent_22%),radial-gradient(circle_at_88%_72%,rgba(132,76,255,0.28),transparent_26%),radial-gradient(circle_at_18%_22%,rgba(48,94,255,0.22),transparent_28%),linear-gradient(180deg,rgba(3,10,25,0.16),#041027_95%)]" />

      <div
        id="cta"
        className="relative mx-auto w-full max-w-[1780px] scroll-mt-24 px-6 py-14 sm:px-10 lg:py-16 xl:px-16 2xl:px-20"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(420px,0.72fr)_minmax(560px,1.28fr)] lg:items-center xl:gap-16 2xl:grid-cols-[650px_minmax(920px,1fr)]">
          <div className="max-w-162.5">
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.24em] text-[#4d77ff]">
              <span className="h-px w-20 bg-[#3156c9]" />
              Simulation lab
              <span className="h-px w-10 bg-[#3156c9]" />
            </div>
            <h2
              aria-label="Ready to make trading plans testable?"
              className="mt-7 text-[3rem] font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-[3rem] xl:text-[3.5rem] 2xl:text-[4rem]"
            >
              <span className="block">Ready to make</span>
              <span className="block">trading plans</span>
              <span className="block bg-[linear-gradient(180deg,#6594ff_0%,#2654ff_100%)] bg-clip-text text-transparent">
                testable?
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-[1.18rem] leading-9 text-[#c5cee6] sm:text-[1.35rem]">
              Use real product visuals to invite early users into a simulation-first workflow for
              copy-trading research, scoring, and execution review.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {featureCards.map(({ title, body, Icon, className }) => (
                <div key={title} className="border-r border-[#21365f] pr-4 last:border-r-0">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${className}`}
                  >
                    <Icon size={29} strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-5 text-base font-bold tracking-[-0.01em] text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-6 text-[#b8c1d8]">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <WorkflowPreview />
        </div>

        <div className="mt-10 grid gap-4 rounded-[22px] border border-[#1c335f] bg-[#071936]/86 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map(({ title, body, Icon, className }) => (
            <div
              key={title}
              className="flex items-center gap-5 border-[#203762] py-2 xl:border-r xl:last:border-r-0"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] border border-[#1d3769] bg-[#0b2043] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <Icon className={className} size={42} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-1 text-[15px] leading-6 text-[#aeb9d4]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowPreview() {
  return (
    <div
      aria-label="trading plan product preview"
      className="relative -mx-2 flex min-h-130 items-center overflow-visible sm:min-h-150 lg:-ml-8 lg:mr-0 lg:min-h-170 xl:min-h-183.75 2xl:-ml-6"
    >
      <img
        src="/trading-plan-workflow-preview.png"
        alt="Trading plan workflow preview"
        className="w-full max-w-245 object-contain"
      />
    </div>
  );
}
