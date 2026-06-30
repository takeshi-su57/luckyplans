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
    className: 'bg-[#e8f0ff] text-[#2d63e2]',
  },
  {
    title: 'Risk aware',
    body: 'Understand risk and drawdown.',
    Icon: ShieldCheck,
    className: 'bg-[#e8f8ef] text-[#159457]',
  },
  {
    title: 'Data driven',
    body: 'Real trades, real outcomes.',
    Icon: Zap,
    className: 'bg-[#f0e7ff] text-[#7a32cc]',
  },
  {
    title: 'Built for security',
    body: 'You stay in control.',
    Icon: LockKeyhole,
    className: 'bg-[#fff3db] text-[#d68400]',
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
    <section className="relative -mt-px overflow-hidden bg-[#f4f8fe] text-[#0b1530]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(45,99,226,0.07),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(31,212,95,0.055),transparent_30%),linear-gradient(180deg,rgba(244,248,254,0)_0%,rgba(255,255,255,0.46)_42%,rgba(244,248,254,0)_100%)]" />

      <div
        id="cta"
        className="relative mx-auto w-full max-w-[1560px] scroll-mt-24 px-4 py-14 sm:px-8 lg:py-20 xl:px-10"
      >
        <div className="rounded-[22px] border border-white/65 bg-[linear-gradient(135deg,rgba(251,253,255,0.76)_0%,rgba(238,245,255,0.58)_50%,rgba(248,251,255,0.72)_100%)] px-5 py-8 shadow-[0_20px_64px_rgba(35,68,132,0.07)] sm:px-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="mx-auto max-w-[1160px] text-center">
            <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.24em] text-[#2d63e2]">
              <span className="h-px w-20 bg-[#bfd1ff]" />
              Simulation lab
              <span className="h-px w-10 bg-[#bfd1ff]" />
            </div>
            <h2
              aria-label="Ready to make trading plans testable?"
              className="mx-auto mt-7 max-w-[820px] text-[2.75rem] font-black leading-[1.05] tracking-[-0.035em] text-[#0b1530] sm:text-[3.2rem] xl:text-[3.65rem]"
            >
              <span className="block">Ready to make trading plans</span>
              <span className="block text-[#2d63e2]">testable?</span>
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-[1.08rem] leading-8 text-[#425373] sm:text-[1.18rem]">
              Use real product flows to invite early users into a simulation-first workflow for
              copy-trading research, scoring, and execution review.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featureCards.map(({ title, body, Icon, className }) => (
                <div
                  key={title}
                  className="rounded-[16px] border border-[#dfe8f7] bg-white/82 p-4 text-left shadow-[0_12px_32px_rgba(34,58,116,0.06)]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${className}`}
                  >
                    <Icon size={25} strokeWidth={2.35} />
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold tracking-[-0.01em] text-[#0b1530]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-6 text-[#526180]">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 rounded-[18px] border border-[#e1eaf7] bg-white/56 p-4 shadow-[0_12px_36px_rgba(34,58,116,0.05)] backdrop-blur-sm md:grid-cols-2 xl:grid-cols-4">
            {valueCards.map(({ title, body, Icon, className }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-[14px] border border-[#e5ecf7] bg-white/78 p-4"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-[#dfe8f7] bg-[#f7faff]">
                  <Icon className={className} size={30} strokeWidth={1.9} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0b1530]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#526180]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
