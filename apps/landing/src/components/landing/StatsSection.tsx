import { ReactNode } from 'react';
import { BarChart3, RefreshCw, ShieldCheck, Target, Zap } from 'lucide-react';

const workflowSteps = [
  {
    step: '1',
    title: 'Discover traders',
    description: 'Filter leader histories before deeper testing.',
    footer: [
      ['450+', 'Tracked traders'],
      ['4', 'Active platforms'],
    ],
    Mock: DiscoverTradersMock,
  },
  {
    step: '2',
    title: 'Generate plans',
    description: 'Create reusable simulation windows and bot plans.',
    footer: [
      ['128', 'Plans'],
      ['33', 'Bots'],
      ['5m', 'Avg. setup'],
    ],
    Mock: GeneratePlansMock,
  },
  {
    step: '3',
    title: 'Analyze results',
    description: 'Review PnL, drawdown, trades, and profit factor.',
    footer: [
      ['471,797', 'Follower PnL'],
      ['38.9%', 'Win rate'],
      ['1.07', 'Profit factor'],
    ],
    Mock: AnalyzeResultsMock,
  },
];

const trustItems = [
  {
    title: 'One operating loop',
    text: 'Discover -> Plan -> Analyze',
    Icon: RefreshCw,
    tone: 'text-[#5d6ff4] bg-[#eef2ff]',
  },
  {
    title: 'Data you can trust',
    text: 'Real trades, real outcomes',
    Icon: ShieldCheck,
    tone: 'text-[#2d63e2] bg-[#eef5ff]',
  },
  {
    title: 'Built for alpha',
    text: 'Fast iteration, better edge',
    Icon: Zap,
    tone: 'text-[#14a861] bg-[#eafaf1]',
  },
  {
    title: 'Act with confidence',
    text: 'Test first, copy later',
    Icon: Target,
    tone: 'text-[#ef4444] bg-[#fff1f1]',
  },
];

export function StatsSection() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_6%,rgba(45,99,226,0.14),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(34,197,94,0.11),transparent_24%),linear-gradient(90deg,rgba(255,255,255,0.9),transparent_40%,rgba(255,255,255,0.55))]" />

      <div className="relative mx-auto max-w-370 px-5 sm:px-8 lg:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#2d63e2]">
              Core workflow
            </div>
            <h2 className="mt-5 max-w-5xl text-[2rem]! font-black leading-[1.02] tracking-[-0.055em] text-[#071126] sm:text-[3rem]! lg:text-[3rem]!">
              Discover traders, generate plans, and analyze results in one system.
            </h2>
            <p className="mt-6 max-w-4xl text-[17px] leading-8 text-[#65728e] sm:text-[19px]">
              The alpha product already exposes the real operating loop: filter leaders, build
              simulation plans, and review PnL, trades, win rate, and profit factor before live
              copy.
            </p>
          </div>

          <WorkflowOrb />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
          {workflowSteps.map(({ step, title, description, footer, Mock }) => (
            <WorkflowCard
              key={step}
              step={step}
              title={title}
              description={description}
              footer={footer}
            >
              <Mock />
            </WorkflowCard>
          ))}
        </div>

        <div className="mt-12 grid gap-3 rounded-[30px] border border-white/80 bg-white/72 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map(({ title, text, Icon, tone }) => (
            <div key={title} className="flex items-center gap-4 rounded-[22px] p-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="text-sm font-black text-[#101b31]">{title}</div>
                <div className="mt-1 text-sm text-[#66728d]">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({
  step,
  title,
  description,
  footer,
  children,
}: {
  step: string;
  title: string;
  description: string;
  footer: string[][];
  children: ReactNode;
}) {
  return (
    <article className="group rounded-[32px] border border-white/85 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(37,99,235,0.14)]">
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#4b82ff_0%,#2563eb_100%)] text-lg font-black text-white shadow-[0_14px_26px_rgba(37,99,235,0.28)]">
          {step}
        </div>
        <div>
          <h3 className="text-[1.45rem]! font-black leading-tight tracking-[-0.035em] text-[#071126]">
            {title}
          </h3>
          <p className="mt-2 text-[15px] leading-7 text-[#66728d]">{description}</p>
        </div>
      </div>

      {children}

      <div
        className="mt-5 grid gap-3"
        style={{ gridTemplateColumns: `repeat(${footer.length}, minmax(0, 1fr))` }}
      >
        {footer.map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-[#f7faff] p-3">
            <div className="font-mono text-[18px] font-black text-[#101b31]">{value}</div>
            <div className="mt-1 text-xs font-medium text-[#72809a]">{label}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

function WorkflowOrb() {
  return (
    <div className="relative hidden h-52 items-center justify-center lg:flex">
      <div className="absolute h-44 w-44 rounded-[46px] border border-white/80 bg-white/56 shadow-[0_24px_80px_rgba(37,99,235,0.14)] backdrop-blur-xl" />
      <div className="absolute h-36 w-36 translate-x-5 translate-y-4 rounded-[38px] border border-[#d8e5ff] bg-[#e9f1ff]/80" />
      <div className="absolute h-24 w-24 rounded-[30px] bg-white shadow-[0_18px_50px_rgba(37,99,235,0.18)]" />
      <BarChart3 className="relative z-10 text-[#5b86f7]" size={42} />
      <span className="absolute left-10 top-10 h-3 w-3 rounded-full bg-[#7ba0ff] shadow-[0_0_22px_rgba(123,160,255,0.8)]" />
      <span className="absolute right-10 top-16 h-3 w-3 rounded-full bg-[#41c56b] shadow-[0_0_22px_rgba(65,197,107,0.75)]" />
      <span className="absolute bottom-8 left-16 h-4 w-4 rounded-full bg-[#9b6cff] shadow-[0_0_24px_rgba(155,108,255,0.75)]" />
    </div>
  );
}

function DiscoverTradersMock() {
  return (
    <div className="rounded-[24px] border border-[#dfe7f5] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge>GNS</Badge>
        <Badge>GMX</Badge>
        <Badge green>Hide Degens</Badge>
      </div>
      <div className="space-y-3">
        {[
          ['0xe432e...c0f90', '$14,754.9', 'green'],
          ['0xe432e...c0f91', '$14,754.9', 'red'],
        ].map(([address, pnl, tone]) => (
          <div key={address} className="rounded-[20px] border border-[#dfe7f5] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[14px] font-black text-[#172033]">{address}</div>
                <div className="mt-3 text-xs font-medium text-[#72809a]">Total PnL</div>
                <div className="mt-1 text-[20px] font-black text-[#11a765]">{pnl}</div>
              </div>
              <Badge>Expert</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniChart label="ACC PNL" tone="green" />
              <MiniChart label="ACC In/Out" tone={tone as 'green' | 'red'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratePlansMock() {
  const plans = [
    ['test 2026-05-01', 'Plan 366', 'Bot 33', 'May 1', 'May 2'],
    ['test 2026-05-02', 'Plan 367', 'Bot 31', 'May 2', 'May 3'],
    ['test 2026-05-03', 'Plan 368', 'Bot 33', 'May 3', 'May 4'],
    ['test 2026-05-04', 'Plan 369', 'Bot 33', 'May 4', 'May 5'],
    ['test 2026-05-05', 'Plan 370', 'Bot 33', 'May 5', 'May 6'],
  ];

  return (
    <div className="rounded-[24px] border border-[#dfe7f5] bg-white p-4">
      <div className="grid grid-cols-3 gap-2 border-b border-[#e4ebf7] pb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#72809a]">
        <span>Plan</span>
        <span>Bot</span>
        <span>Window</span>
      </div>
      <div className="divide-y divide-[#e8eef8]">
        {plans.map(([name, plan, bot, start, end]) => (
          <div key={name} className="grid grid-cols-[1.25fr_0.55fr_0.8fr] gap-3 py-3 text-sm">
            <div>
              <div className="font-bold text-[#172033]">{name}</div>
              <Badge>{plan}</Badge>
            </div>
            <div className="pt-1">
              <Badge>{bot}</Badge>
            </div>
            <div className="pt-1 text-[13px] font-semibold text-[#4f5f79]">
              {start} {'->'} {end}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyzeResultsMock() {
  return (
    <div className="rounded-[24px] border border-[#dfe7f5] bg-white p-4">
      <div className="rounded-[20px] border border-[#dfe7f5]">
        <div className="flex items-center gap-2 border-b border-[#e4ebf7] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <div className="ml-2 text-sm font-black text-[#172033]">Simulation results</div>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>Simulation 18</Badge>
            <Badge purple>Running</Badge>
            <Badge>GNS</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SmallBox label="Start" value="Apr 30, 20:00" />
            <SmallBox label="Cursor" value="Not started" />
            <SmallBox label="End" value="May 9, 20:00" />
            <SmallBox label="Plans" value="0 / 9" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge green>471,797 Net PnL</Badge>
            <Badge yellow>0 Cost</Badge>
            <Badge purple>563 Trades</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({
  children,
  green,
  yellow,
  purple,
}: {
  children: ReactNode;
  green?: boolean;
  yellow?: boolean;
  purple?: boolean;
}) {
  const color = green
    ? 'bg-[#dff8ea] text-[#11a765]'
    : yellow
      ? 'bg-[#fff1d8] text-[#d78300]'
      : purple
        ? 'bg-[#efe4ff] text-[#7a35d8]'
        : 'bg-[#e9f0ff] text-[#2d63e2]';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${color}`}>
      {children}
    </span>
  );
}

function SmallBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#dfe7f5] bg-[#f8fbff] p-3">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a98af]">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-[#172033]">{value}</div>
    </div>
  );
}

function MiniChart({ label, tone }: { label: string; tone: 'green' | 'red' }) {
  const isGreen = tone === 'green';

  return (
    <div>
      <div className="mb-2 text-xs font-black text-[#172033]">{label}</div>
      <div className="h-16 overflow-hidden rounded-xl border border-[#dfe7f5] bg-[#f8fbff]">
        <svg
          viewBox="0 0 160 64"
          className="h-full w-full"
          role="img"
          aria-label={`${label} chart`}
        >
          <path
            d={
              isGreen
                ? 'M0 48 L20 44 L40 42 L60 34 L80 28 L100 32 L120 34 L140 38 L160 35 L160 64 L0 64 Z'
                : 'M0 40 L20 42 L40 36 L60 30 L80 25 L100 29 L120 31 L140 36 L160 34 L160 64 L0 64 Z'
            }
            fill={isGreen ? 'rgba(17,167,101,0.76)' : 'rgba(239,68,68,0.72)'}
          />
        </svg>
      </div>
    </div>
  );
}
