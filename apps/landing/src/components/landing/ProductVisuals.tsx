import { HTMLAttributes, ReactNode } from 'react';

function WindowDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3.5 w-3.5 rounded-full bg-[#ff6b5c]" />
      <span className="h-3.5 w-3.5 rounded-full bg-[#ffbe2f]" />
      <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function Surface({
  children,
  className = '',
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`lp-surface rounded-[28px] border border-[#d7e1f4] bg-white shadow-[0_24px_80px_rgba(55,84,170,0.10)] ${className}`}
    >
      {children}
    </div>
  );
}

function WindowFrame({
  title,
  children,
  className = '',
  chromeClassName = '',
  bodyClassName = '',
  titleClassName = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
  chromeClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
}) {
  return (
    <Surface className={`overflow-hidden ${className}`}>
      <div
        className={`flex items-center gap-4 border-b border-[#edf1f8] bg-[#f9fbff] px-6 py-4 ${chromeClassName}`}
      >
        <WindowDots />
        <div
          className={`text-[15px] font-semibold text-[#444b59] md:text-[18px] ${titleClassName}`}
        >
          {title}
        </div>
      </div>
      <div className={`bg-white p-6 ${bodyClassName}`}>{children}</div>
    </Surface>
  );
}

function LabelPill({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'purple' | 'gold' | 'red' | 'gray';
}) {
  const tones = {
    blue: 'bg-[#d7e4ff] text-[#2d63e2]',
    green: 'bg-[#d6f4dd] text-[#19a566]',
    purple: 'bg-[#ead8ff] text-[#7f35d8]',
    gold: 'bg-[#f9ecd1] text-[#c38a24]',
    red: 'bg-[#ffd8d8] text-[#e73b3b]',
    gray: 'bg-[#eff3f9] text-[#6b7894]',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function StatMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-[160px] rounded-[24px] bg-white px-6 py-4 shadow-[0_16px_40px_rgba(18,26,64,0.12)]">
      <div className="text-sm font-semibold text-[#62708c]">{label}</div>
      <div
        className={`mt-2 text-[28px] font-medium tracking-tight ${valueClassName ?? 'text-[#2d63e2]'}`}
      >
        {value}
      </div>
    </div>
  );
}

function HeroStatCard({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: string;
  accentClassName: string;
}) {
  return (
    <div className="min-w-[150px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,34,0.96)_0%,rgba(10,14,21,0.96)_100%)] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="text-[12px] font-semibold text-[#8fa0b9]">{label}</div>
      <div className={`mt-2 text-[30px] font-semibold tracking-tight ${accentClassName}`}>
        {value}
      </div>
    </div>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#edf1f8] bg-[#fcfdff] px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7d879b]">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#555c6e]">{value}</div>
    </div>
  );
}

function MetricTag({ label, tone }: { label: string; tone: 'green' | 'gold' | 'purple' | 'blue' }) {
  const classes = {
    green: 'bg-[#daf4df] text-[#199b5f]',
    gold: 'bg-[#faecd0] text-[#ba8f40]',
    purple: 'bg-[#e9d8fe] text-[#7f35d8]',
    blue: 'bg-[#d7e4ff] text-[#2d63e2]',
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${classes[tone]}`}>{label}</span>
  );
}

function SimulationListCard({ status }: { status: 'Running' | 'Completed' }) {
  const running = status === 'Running';

  return (
    <div className="rounded-[24px] border border-[#edf1f8] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(55,84,170,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[#2f3542]">test</span>
          <LabelPill tone="gray">{running ? 'Simulation 18' : 'Simulation 17'}</LabelPill>
          <LabelPill tone={running ? 'blue' : 'green'}>{status}</LabelPill>
          <LabelPill tone="purple">GNS</LabelPill>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-xl bg-[#d8e5ff] px-4 py-2 text-sm font-semibold text-[#2d63e2]">
            {running ? 'Resume' : 'Show Plans'}
          </button>
          {running && (
            <button className="rounded-xl bg-[#ffd8d8] px-4 py-2 text-sm font-semibold text-[#e45757]">
              Cancel
            </button>
          )}
          <button className="rounded-xl bg-[#ef2f2f] px-4 py-2 text-sm font-semibold text-white">
            Remove
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <FieldBox label="Start" value="Apr 30, 20:00" />
        <FieldBox label="Cursor" value={running ? 'Not started' : 'May 9, 20:00'} />
        <FieldBox label="End" value="May 9, 20:00" />
        <FieldBox label="Plans" value={running ? '0 / 9' : '9 / 9'} />
        <FieldBox label="Leader selection" value="Uncapped" />
      </div>

      <div className="mt-4 h-1 rounded-full bg-[#edf1f8]">
        <div
          className={`h-full rounded-full ${running ? 'w-0 bg-[#2d63e2]' : 'w-full bg-[#2d63e2]'}`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MetricTag label="471.797 Net PnL" tone="green" />
        <MetricTag label="0 Cost" tone="gold" />
        <MetricTag label="563 Trades" tone="purple" />
        <MetricTag label={running ? '0.00% Win Rate' : '0.39% Win Rate'} tone="blue" />
        <MetricTag label={running ? '0.00 Profit Factor' : '1.07 Profit Factor'} tone="blue" />
      </div>
    </div>
  );
}

function HeroFilterPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-[#8fa0b9]">
      {children}
    </span>
  );
}

function TinyAreaChart({ negative = false }: { negative?: boolean }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-3xl border border-[#edf1f8] bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_20%,#edf1f8_20%,#edf1f8_21%,transparent_21%,transparent_40%,#edf1f8_40%,#edf1f8_41%,transparent_41%,transparent_60%,#edf1f8_60%,#edf1f8_61%,transparent_61%,transparent_80%,#edf1f8_80%,#edf1f8_81%,transparent_81%)] opacity-80" />
      <div
        className={`absolute bottom-0 left-0 right-0 h-[72%] [clip-path:polygon(0_78%,8%_70%,15%_72%,22%_64%,30%_52%,40%_48%,50%_35%,61%_40%,72%_44%,82%_53%,90%_58%,100%_52%,100%_100%,0_100%)] ${
          negative ? 'bg-[#ff5b60]' : 'bg-[#1ba46a]'
        }`}
      />
    </div>
  );
}

function TinyBars() {
  return (
    <div className="flex h-28 items-end gap-1 overflow-hidden rounded-3xl border border-[#edf1f8] bg-white px-3 pb-3 pt-4">
      {Array.from({ length: 48 }).map((_, index) => {
        const height = 12 + ((index * 17) % 58);
        const negative = index % 4 === 0 || index % 7 === 0;
        return (
          <div
            key={index}
            className={`w-1.5 rounded-sm ${negative ? 'bg-[#ff6e78]' : 'bg-[#31cd93]'}`}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}

function SectionEyebrow({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green';
}) {
  return (
    <div
      className={`text-sm font-semibold ${tone === 'green' ? 'text-[#16a165]' : 'text-[#2d63e2]'}`}
    >
      {children}
    </div>
  );
}

function HeroLineChart({
  color,
  fill,
  negative = false,
}: {
  color: string;
  fill: string;
  negative?: boolean;
}) {
  const linePoints = negative
    ? '0,28 18,28 34,46 52,26 82,54 118,22 156,62 194,104 230,120 272,12'
    : '0,114 22,114 42,108 76,108 112,78 148,78 190,78 232,78 272,14';
  const areaPoints = negative
    ? '0,28 18,28 34,46 52,26 82,54 118,22 156,62 194,104 230,120 272,12 272,140 0,140'
    : '0,114 22,114 42,108 76,108 112,78 148,78 190,78 232,78 272,14 272,140 0,140';

  return (
    <div className="relative h-[136px] overflow-hidden rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,#131a24_0%,#0d1218_100%)]">
      <div className="absolute inset-x-0 top-4 h-px bg-white/6" />
      <div className="absolute inset-x-0 top-[52px] h-px bg-white/6" />
      <div className="absolute inset-x-0 top-[88px] h-px bg-white/6" />
      <svg viewBox="0 0 272 140" className="absolute inset-0 h-full w-full">
        <polygon points={areaPoints} fill={fill} opacity={negative ? 0.26 : 0.22} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function HeroMetricRow({
  label,
  value,
  valueClassName = 'text-[#202630]',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-[#8fa0b9]">{label}</span>
      <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function HeroProductVisual() {
  return (
    <div aria-label="hero product preview" className="relative">
      <div className="absolute -left-10 bottom-14 z-20 grid gap-3 lg:-left-16">
        <HeroStatCard label="Net PnL" value="$471.80" accentClassName="text-[#27d56b]" />
        <HeroStatCard label="Trades" value="563" accentClassName="text-[#be78ff]" />
        <HeroStatCard label="Profit Factor" value="1.07" accentClassName="text-[#5aa1ff]" />
      </div>

      <WindowFrame
        title="Simulation dashboard"
        className="border-white/8 bg-[linear-gradient(180deg,rgba(20,25,34,0.94)_0%,rgba(9,12,18,0.97)_100%)] pt-10 shadow-[0_34px_90px_rgba(0,0,0,0.42)]"
        chromeClassName="border-white/8 bg-[linear-gradient(180deg,#1b2029_0%,#151a22_100%)]"
        bodyClassName="bg-transparent"
        titleClassName="text-[#edf2fa]"
      >
        <div className="space-y-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <HeroFilterPill>Platform: GNS</HeroFilterPill>
              <HeroFilterPill>Date: 06 / 29 / 2026</HeroFilterPill>
              <HeroFilterPill>Descending</HeroFilterPill>
            </div>
            <button className="rounded-full bg-[linear-gradient(180deg,#1fd45f_0%,#15b650_100%)] px-5 py-2.5 text-sm font-semibold text-[#05130c] shadow-[0_10px_24px_rgba(31,212,95,0.20)]">
              Analyze
            </button>
          </div>

          <div className="grid gap-4 rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.02)_100%)] p-4 lg:grid-cols-[0.96fr_1.24fr]">
            <div className="space-y-3">
              <div className="rounded-[24px] border border-white/8 bg-[#0d1218] p-4">
                <div className="font-mono text-[18px] text-[#f3f6fb]">0x25480...7c50d</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#173f29] px-3 py-1 text-[11px] font-semibold text-[#45db79]">
                    Expert
                  </span>
                  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold text-[#90a3bf]">
                    22 positions
                  </span>
                </div>
                <div className="mt-4 grid gap-3">
                  <HeroMetricRow
                    label="Total PnL"
                    value="$15,184.4"
                    valueClassName="text-[#27d56b]"
                  />
                  <HeroMetricRow
                    label="Average PnL"
                    value="$690.20"
                    valueClassName="text-[#27d56b]"
                  />
                  <HeroMetricRow
                    label="Avg. leverage"
                    value="1.84x"
                    valueClassName="text-[#ebf0f8]"
                  />
                  <HeroMetricRow
                    label="R2 confidence"
                    value="0.79"
                    valueClassName="text-[#ebf0f8]"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[#0d1218] p-4">
                <div className="text-sm font-semibold text-[#90a3bf]">Review signals</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <MetricTag label="Positive slope" tone="green" />
                  <MetricTag label="Filtered" tone="blue" />
                  <MetricTag label="Follower-safe" tone="purple" />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/8 bg-[#0d1218] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#f3f6fb]">ACC PNL</div>
                  <div className="text-xs font-semibold text-[#90a3bf]">
                    Min $0 <span className="ml-2 text-[#27d56b]">$15,184.4</span>
                  </div>
                </div>
                <HeroLineChart color="#13c38b" fill="#13c38b" />
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[#0d1218] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#f3f6fb]">ACC In / Out</div>
                  <div className="text-xs font-semibold text-[#90a3bf]">
                    Min $-88,892.7 <span className="ml-2 text-[#27d56b]">$15,178.2</span>
                  </div>
                </div>
                <HeroLineChart color="#ff4d73" fill="#ff4d73" negative />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8192ac]">
                First activity
              </div>
              <div className="mt-2 text-base font-semibold text-[#edf2fa]">2026 / 04 / 26</div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8192ac]">
                Avg. duration
              </div>
              <div className="mt-2 text-base font-semibold text-[#edf2fa]">244.02 mins</div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8192ac]">
                Avg. pnl by size
              </div>
              <div className="mt-2 text-base font-semibold text-[#27d56b]">8.22%</div>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

export function ProblemVisual() {
  return (
    <div aria-label="problem preview" className="relative">
      <img
        src="/problem-risk-dashboard-preview.png"
        alt="Problem risk dashboard preview"
        className="w-full rounded-[18px] object-contain shadow-[0_22px_60px_rgba(34,58,116,0.10)]"
      />
    </div>
  );
}

export function SolutionVisual() {
  return (
    <div aria-label="solution preview" className="relative">
      <img
        src="/solution-simulation-results-preview.png"
        alt="Solution simulation results preview"
        className="w-full rounded-[18px] object-contain shadow-[0_22px_60px_rgba(34,58,116,0.10)]"
      />
    </div>
  );
}

export function DiscoverTradersVisual() {
  return (
    <Surface aria-label="discover traders preview" className="p-8">
      <div className="flex flex-wrap gap-3">
        <LabelPill tone="blue">GNS</LabelPill>
        <LabelPill tone="gray">GMX</LabelPill>
        <LabelPill tone="green">Hide Degens</LabelPill>
      </div>

      <div className="mt-8 space-y-6">
        {[0, 1].map((row) => (
          <div
            key={row}
            className="grid gap-6 rounded-[28px] border border-[#dde6f5] bg-white px-6 py-6 lg:grid-cols-[1.15fr_1fr_1fr]"
          >
            <div>
              <div className="font-mono text-[22px] text-[#222833]">0xe43e2...c0f9{row}</div>
              <div className="mt-4">
                <LabelPill tone="blue">Expert</LabelPill>
              </div>
              <div className="mt-4 text-[17px] text-[#65728e]">
                Total PnL:{' '}
                <span className="ml-2 text-[18px] font-medium text-[#16a165]">$14,754.9</span>
              </div>
            </div>
            <div>
              <div className="text-[20px] font-semibold text-[#222833]">ACC PNL</div>
              <div className="mt-3">
                <TinyAreaChart />
              </div>
            </div>
            <div>
              <div className="text-[20px] font-semibold text-[#222833]">ACC In/Out</div>
              <div className="mt-3">
                <TinyAreaChart negative={row === 1} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

export function GeneratePlansVisual() {
  return (
    <Surface aria-label="generate plans preview" className="p-8">
      <div className="space-y-6">
        {['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05'].map(
          (date, index) => (
            <div
              key={date}
              className="grid gap-4 rounded-[24px] border border-[#dde6f5] bg-white px-6 py-5 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[18px] font-semibold text-[#7284a6]">test {date}</div>
                <LabelPill tone="gray">Simulation Plan {366 + index}</LabelPill>
                <LabelPill tone="blue">Bot {index % 2 === 0 ? 33 : 30 + index}</LabelPill>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[15px] text-[#66728d]">
                <div>
                  Start At:{' '}
                  <span className="ml-2 font-semibold text-[#202630]">
                    May {index + 1}, 20:0{index % 2}
                  </span>
                </div>
                <div>
                  End At:{' '}
                  <span className="ml-2 font-semibold text-[#202630]">
                    May {index + 2}, 20:0{index % 2}
                  </span>
                </div>
              </div>
              <button className="rounded-full bg-[#d8e5ff] px-5 py-3 text-sm font-semibold text-[#2d63e2]">
                Show Details
              </button>
            </div>
          ),
        )}
      </div>
    </Surface>
  );
}

export function AnalyzeResultsVisual() {
  return (
    <div aria-label="analyze results preview">
      <WindowFrame title="Simulation results">
        <div className="space-y-5">
          <SimulationListCard status="Running" />
          <div className="grid gap-4 md:grid-cols-3">
            <StatMetric label="Follower PnL" value="471.797" valueClassName="text-[#19a566]" />
            <StatMetric label="Win Rate" value="38.9%" />
            <StatMetric label="Profit Factor" value="1.07" valueClassName="text-[#7f35d8]" />
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

export function AutoSimulationListVisual() {
  return (
    <div aria-label="auto simulation list preview">
      <WindowFrame title="Auto simulation list">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <LabelPill tone="gray">Auto Simulations</LabelPill>
            <LabelPill tone="gray">Manual Plans</LabelPill>
          </div>
          <SimulationListCard status="Running" />
          <SimulationListCard status="Completed" />
        </div>
      </WindowFrame>
    </div>
  );
}

export function WorkflowControlsVisual() {
  return (
    <div aria-label="workflow controls preview">
      <WindowFrame title="Workflow controls">
        <div className="space-y-5">
          <div className="flex items-center justify-end gap-3">
            <button className="rounded-full bg-[#d8e5ff] px-5 py-3 text-sm font-semibold text-[#2d63e2]">
              + Auto Simulation
            </button>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#2d63e2] shadow-[inset_0_0_0_1px_rgba(45,99,226,0.14)]">
              Manual Plan
            </button>
          </div>
          <div className="rounded-[24px] border border-[#edf1f8] bg-white p-5 shadow-[0_8px_24px_rgba(55,84,170,0.05)]">
            <div className="flex items-center justify-end gap-3">
              <button className="rounded-xl bg-[#d8e5ff] px-4 py-2 text-sm font-semibold text-[#2d63e2]">
                Resume
              </button>
              <button className="rounded-xl bg-[#ffd8d8] px-4 py-2 text-sm font-semibold text-[#e45757]">
                Cancel
              </button>
              <button className="rounded-xl bg-[#ef2f2f] px-4 py-2 text-sm font-semibold text-white">
                Remove
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <FieldBox label="Plans" value="9 / 9" />
              <FieldBox label="Leader selection" value="Uncapped" />
              <FieldBox label="Status" value="Accepted" />
            </div>
            <div className="mt-5 h-1 rounded-full bg-[#edf1f8]">
              <div className="h-full w-[65%] rounded-full bg-[#2d63e2]" />
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

export function SimulationEngineVisual() {
  const positions: Array<[string, string, string, boolean]> = [
    ['ton/usd', '+$15', 'Opened', true],
    ['virtual/usd', '+$1', 'Opened', true],
    ['btc/usd', '+$27', 'Opened', true],
    ['uni/usd', '-$8', 'Closed', false],
  ];

  return (
    <Surface aria-label="simulation engine preview" className="p-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[28px] border border-[#dde6f5] bg-white p-6">
          <div className="text-[22px] font-semibold text-[#202630]">Opened Positions</div>
          <div className="mt-6 space-y-4">
            {positions.map(([pair, pnl, state, positive]) => (
              <div key={pair} className="rounded-[24px] bg-[#f3eaee] px-6 py-5">
                <div className="font-mono text-[18px] text-[#222833]">{pair}</div>
                <div
                  className={`mt-3 text-[18px] font-semibold ${positive ? 'text-[#16a165]' : 'text-[#ef3131]'}`}
                >
                  PnL: {pnl}
                </div>
                <div className="mt-3">
                  <LabelPill tone={positive ? 'gold' : 'green'}>{state}</LabelPill>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC PNL</div>
            <TinyAreaChart />
          </div>
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC In/Out</div>
            <TinyAreaChart negative />
          </div>
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">PNL</div>
            <TinyBars />
          </div>
        </div>
      </div>
    </Surface>
  );
}

export function IntelligenceVisual() {
  return (
    <Surface aria-label="intelligence preview" className="p-8">
      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <div className="rounded-[30px] border border-[#dde6f5] bg-white px-8 py-7">
          <div className="text-[18px] font-semibold text-[#65728d]">Recommended: Default copy</div>
          <div className="mt-5 space-y-6">
            {[
              ['Default copy', '21', 'Good when leader has positive slope and R2 close to 1.'],
              ['Reverse copy', '18', 'Useful to test weak or unstable leader behavior.'],
            ].map(([title, score, body]) => (
              <div key={title} className="rounded-[28px] border border-[#dde6f5] p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[24px] font-semibold text-[#202630]">{title}</div>
                    <p className="mt-2 text-base leading-7 text-[#66728d]">{body}</p>
                  </div>
                  <div className="rounded-[20px] bg-[#ffd8ec] px-4 py-3 text-center text-[#ea4ea0]">
                    <div className="text-[22px] font-semibold">{score}</div>
                    <div className="text-sm font-semibold">Weak</div>
                  </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-[#222833]">
                  <div className="h-full w-[15%] rounded-full bg-[#ea4ea0]" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 text-base text-[#66728d]">
                  <div>
                    Suggested collateral
                    <div className="text-[18px] font-semibold text-[#202630]">$20.59</div>
                    <div className="mt-2">
                      Win rate <span className="font-semibold text-[#202630]">59%</span>
                    </div>
                  </div>
                  <div>
                    Suggested ratio
                    <div className="text-[18px] font-semibold text-[#202630]">0.0086x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC PNL</div>
            <TinyAreaChart />
          </div>
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC In/Out</div>
            <TinyAreaChart negative />
          </div>
          <div>
            <div className="mb-3 text-[20px] font-semibold text-[#202630]">
              Trade PnL Distribution
            </div>
            <TinyBars />
          </div>
        </div>
      </div>
    </Surface>
  );
}

export function LeaderboardVisual() {
  return (
    <Surface aria-label="leaderboard preview" className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <LabelPill tone="gray">Platform: GNS</LabelPill>
          <LabelPill tone="gray">Date: 06 / 26 / 2026</LabelPill>
          <LabelPill tone="blue">Desc</LabelPill>
          <LabelPill tone="blue">Filtered</LabelPill>
          <LabelPill tone="blue">Hide Degens</LabelPill>
        </div>
        <button className="rounded-full bg-[#2d63e2] px-6 py-3 text-sm font-semibold text-white">
          Analyze
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {[
          ['0xe43e2...c0f90', '$86.79', '6.51x'],
          ['0xe43e2...c0f91', '$524.84', '2.57x'],
        ].map(([address, avgPnl, avgLev], index) => (
          <div
            key={address}
            className="grid gap-6 rounded-[28px] border border-[#dde6f5] bg-white px-6 py-6 lg:grid-cols-[1.2fr_1fr_1fr]"
          >
            <div className="space-y-4">
              <div className="font-mono text-[20px] text-[#222833]">{address}</div>
              <div className="grid grid-cols-2 gap-4 text-[15px] text-[#66728d]">
                <div>
                  Invested <span className="ml-3 font-medium text-[#202630]">$22,723.8</span>
                </div>
                <div>
                  Positions{' '}
                  <span className="ml-3 font-medium text-[#202630]">{index === 0 ? 170 : 27}</span>
                </div>
                <div>
                  Avg PnL <span className="ml-3 font-medium text-[#16a165]">{avgPnl}</span>
                </div>
                <div>
                  Avg Leverage <span className="ml-3 font-medium text-[#202630]">{avgLev}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <LabelPill tone="blue">Expert</LabelPill>
                <span className="text-[18px] font-medium text-[#202630]">
                  {index === 0 ? '0.74' : '0.03'}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC PNL</div>
              <TinyAreaChart negative={index === 1} />
            </div>
            <div>
              <div className="mb-3 text-[20px] font-semibold text-[#202630]">ACC In/Out</div>
              <TinyAreaChart negative />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

export function PlatformVisual() {
  return (
    <Surface aria-label="platform preview" className="p-8">
      <div className="flex flex-wrap gap-7">
        {['Contracts', 'PnL Snapshot', 'Users', 'Controls'].map((tab, index) => (
          <button
            key={tab}
            className={`rounded-[18px] border px-7 py-4 text-[16px] ${
              index === 0
                ? 'border-[#d7e1f4] bg-white text-[#202630]'
                : 'border-[#d7e1f4] bg-[#f7f9fe] text-[#6c7895]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <FieldBox label="Platform *" value="GNS" />
        <FieldBox label="Version *" value="V9" />
      </div>

      <div className="mt-12 overflow-hidden rounded-[28px] border border-[#dde6f5]">
        <div className="grid grid-cols-[100px_1.9fr_0.9fr_0.8fr_1.3fr] bg-[#f9fbff] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6d7894]">
          <div>ID</div>
          <div>Address</div>
          <div>Progress</div>
          <div>Status</div>
          <div />
        </div>
        {[
          ['1', '0x209a9...13607', '137'],
          ['2', '0x209a9...14562', '8453'],
          ['3', '0xff162...70067', '42161'],
          ['5', '0x2be5d...18412', '33139'],
        ].map(([id, address, chain]) => (
          <div
            key={id}
            className="grid grid-cols-[100px_1.9fr_0.9fr_0.8fr_1.3fr] items-center border-t border-[#edf1f8] px-6 py-6"
          >
            <div className="text-[18px] text-[#61708d]">{id}</div>
            <div>
              <div className="font-mono text-[18px] text-[#202630]">{address}</div>
              <div className="mt-2 text-[15px] text-[#61708d]">Chain ID: {chain}</div>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#18a765] text-sm font-semibold text-[#18a765]">
                100%
              </div>
              <div className="mt-2 text-[15px] text-[#61708d]">Ready</div>
            </div>
            <div>
              <LabelPill tone="gray">Dead</LabelPill>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-[#2d63e2] px-5 py-3 text-sm font-semibold text-white">
                Live
              </button>
              <button className="rounded-full bg-[#2d63e2] px-5 py-3 text-sm font-semibold text-white">
                Start Adaption
              </button>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

export function TrustVisual() {
  return (
    <div aria-label="trust preview" className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
      <Surface className="p-10">
        <div className="text-[28px] font-semibold text-[#202630]">Official checklist</div>
        <div className="mt-8 space-y-6">
          {[
            'Official website',
            'Official Discord',
            'Official X / Twitter',
            'No seed phrase requests',
            'Controlled environment access',
          ].map((item) => (
            <div key={item} className="flex items-center gap-5 text-[18px] text-[#202630]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8f6e7] text-xl text-[#18a765]">
                v
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Surface>

      <div className="rounded-[34px] bg-[#171f3f] px-10 py-10 text-white shadow-[0_24px_80px_rgba(18,26,64,0.14)]">
        <div className="text-[28px] font-semibold">Environment status</div>
        <div className="mt-10 space-y-7">
          {[
            ['Network', 'Arbitrum', 'blue'],
            ['Wallet', '0x3E23a', 'blue'],
            ['Access', 'Admin', 'purple'],
            ['System', 'Running', 'green'],
          ].map(([label, value, tone]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-[22px] bg-white px-7 py-5 text-[#c5d1f4]"
            >
              <span className="text-[18px]">{label}</span>
              <LabelPill tone={tone as 'blue' | 'green' | 'purple'}>{value}</LabelPill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RoadmapVisual() {
  return (
    <div aria-label="roadmap preview" className="relative">
      <div aria-label="roadmap progress timeline">
        <img
          src="/roadmap-progress-preview.png"
          alt="Roadmap progress timeline"
          className="w-full object-contain"
        />
      </div>
    </div>
  );
}

export function FinalCtaVisual() {
  return (
    <div aria-label="final cta preview" className="relative min-h-[420px]">
      <div className="absolute right-20 top-10 w-[520px] rotate-[0deg] rounded-[26px] border border-[#dce5f6] bg-white/95 p-8 shadow-[0_20px_60px_rgba(18,26,64,0.18)]">
        <SectionEyebrow tone="green">The solution</SectionEyebrow>
        <div className="mt-2 text-[18px] font-semibold text-[#202630]">
          Plan, simulate, then decide.
        </div>
        <p className="mt-1 text-sm text-[#66728d]">
          Organize copy-trading research into simulations, plans, metrics, and reviewable results.
        </p>
      </div>
      <div className="absolute bottom-6 left-8 w-[480px] rounded-[28px] border border-[#dce5f6] bg-white p-6 shadow-[0_18px_52px_rgba(18,26,64,0.18)]">
        <div className="text-[20px] font-semibold text-[#202630]">Leaderboard analysis</div>
        <p className="mt-1 text-sm text-[#66728d]">
          Find traders worth deeper simulation with platform filters and activity metrics.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <TinyAreaChart />
          <TinyAreaChart negative />
        </div>
      </div>
      <div className="absolute right-0 top-28 w-[530px] rounded-[28px] border border-[#dce5f6] bg-white p-6 shadow-[0_18px_52px_rgba(18,26,64,0.18)]">
        <div className="text-[20px] font-semibold text-[#202630]">Copy trading intelligence</div>
        <p className="mt-1 text-sm text-[#66728d]">Score behavior before choosing a strategy.</p>
        <div className="mt-4 grid gap-3">
          <TinyAreaChart />
          <TinyAreaChart negative />
          <TinyBars />
        </div>
      </div>
    </div>
  );
}
