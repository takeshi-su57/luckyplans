import { ReactNode } from 'react';

const simulations = [
  ['Apr 30, 2025', 'Running', 'Plan scanned', 'May 3, 10:03'],
  ['Apr 29, 2025', 'Running', 'Breakout Alpha', 'May 3, 09:21'],
  ['Apr 28, 2025', 'Completed', 'Swing Momentum', 'May 2, 16:44'],
  ['Apr 27, 2025', 'Completed', 'Mean Revert', 'May 2, 11:02'],
] as const;

const positions = [
  ['BTC/USDT', 'Long', '+$827', 'green'],
  ['ETH/USDT', 'Long', '+$512', 'green'],
  ['SOL/USDT', 'Long', '+$238', 'green'],
  ['XRP/USDT', 'Long', '+$116', 'gold'],
] as const;

const leaderboard = [
  ['AlphaStrat', '$28.4K', '42.1%', '1.32', 'blue', 'green'],
  ['TrendMaster', '$17.6K', '37.8%', '1.18', 'blue', 'green'],
  ['QuantEdge', '$11.2K', '35.4%', '1.05', 'blue', 'red'],
  ['WaveRider', '$7.9K', '34.2%', '0.94', 'blue', 'red'],
] as const;

const contracts = [
  ['LuckyPlans Core', '137', 'v2.1.0', 'Active'],
  ['LP Signals', '56', 'v1.4.2', 'Active'],
  ['LP Copy', '137', 'v1.3.1', 'Active'],
  ['LP Analytics', '10', 'v0.9.8', 'Inactive'],
] as const;

function FeatureNumber({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#1f6fff_0%,#0758ee_100%)] text-[18px] font-bold text-white shadow-[0_10px_22px_rgba(17,93,255,0.22)]">
      {children}
    </div>
  );
}

function FeatureCard({
  number,
  title,
  body,
  label,
  className = '',
  children,
}: {
  number: string;
  title: string;
  body: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      aria-label={label}
      className={`rounded-[16px] border border-[#dce6f6] bg-white/92 p-4 shadow-[0_18px_54px_rgba(30,57,112,0.08)] backdrop-blur-sm md:p-5 ${className}`}
    >
      <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <div>
          <div className="flex items-start gap-3">
            <FeatureNumber>{number}</FeatureNumber>
            <h3 className="text-[21px] font-black leading-tight tracking-[-0.035em] text-[#081229]">
              {title}
            </h3>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-[#43516f]">{body}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </article>
  );
}

function Panel({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[10px] border border-[#dfe7f4] bg-white p-4 ${className}`}>
      <div className="text-[12px] font-black tracking-[-0.015em] text-[#0b1530]">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const running = status === 'Running';

  return (
    <span
      className={`rounded-[6px] px-2 py-1 text-[10px] font-bold ${
        running ? 'bg-[#e9edff] text-[#185fff]' : 'bg-[#dcf7e9] text-[#0b9e5b]'
      }`}
    >
      {status}
    </span>
  );
}

function LineChart({ tone = 'blue' }: { tone?: 'blue' | 'green' | 'red' }) {
  const stroke = tone === 'green' ? '#12a667' : tone === 'red' ? '#ff424c' : '#1769ff';
  const fill = tone === 'green' ? '#dff7ec' : tone === 'red' ? '#ffe2e2' : '#e7efff';
  const points =
    tone === 'red'
      ? '0,38 18,32 36,36 54,29 72,42 90,34 108,39 126,24 144,28 160,18'
      : '0,44 18,39 36,35 54,20 72,31 90,35 108,28 126,13 144,24 160,9';

  return (
    <svg aria-hidden="true" viewBox="0 0 160 56" className="h-full w-full">
      <polygon points={`${points} 160,56 0,56`} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function BarDistribution() {
  const bars = [2, 3, 5, 8, 18, 26, 20, 9, 5, 4, 10, 19, 42, 28, 16, 34, 12, 18, 8, 6, 5];

  return (
    <div className="flex h-31 items-end gap-1.5 rounded-[10px] border border-[#e5ecf7] bg-white px-4 pb-4">
      {bars.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className={`w-full rounded-t-sm ${
            index < 8 ? 'bg-[#1aae6d]' : index > 16 ? 'bg-[#ff444f]' : 'bg-[#b9c0cc]'
          }`}
          style={{ height }}
        />
      ))}
    </div>
  );
}

function AutoSimulationPanel() {
  return (
    <Panel title="Auto simulation list">
      <div className="grid grid-cols-4 overflow-hidden rounded-[8px] border border-[#e1e8f3] text-center text-[11px] font-bold text-[#64708a]">
        {['All', 'Running', 'Completed', 'Drafts'].map((tab) => (
          <div
            key={tab}
            className={`px-3 py-2 ${tab === 'Running' ? 'bg-[#e9f0ff] text-[#115dff]' : 'bg-white'}`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-[8px] border border-[#edf1f7] text-[11px]">
        <div className="grid grid-cols-[1fr_0.8fr_1.1fr_1fr] bg-[#fbfcff] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7b8498]">
          <div>Simulation</div>
          <div>Status</div>
          <div>Plan</div>
          <div>Started</div>
        </div>
        {simulations.map(([date, status, plan, started]) => (
          <div
            key={`${date}-${plan}`}
            className="grid grid-cols-[1fr_0.8fr_1.1fr_1fr] border-t border-[#edf1f7] px-3 py-2 text-[#0c1730]"
          >
            <div>{date}</div>
            <div>
              <StatusPill status={status} />
            </div>
            <div>{plan}</div>
            <div>{started}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[12px] font-bold text-[#115dff]">View all simulations →</div>
    </Panel>
  );
}

function MetricsPanel() {
  return (
    <Panel title="Result metrics">
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Win Rate', '38.9%', 'text-[#0d5fff]'],
          ['Profit Factor', '1.07', 'text-[#7e33e8]'],
          ['Follower PnL', '$47.2K', 'text-[#0ca963]'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-[8px] border border-[#e3eaf5] bg-[#fbfdff] p-3">
            <div className="text-[10px] font-medium text-[#58647d]">{label}</div>
            <div className={`mt-1 text-[16px] font-black ${color}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[11px] font-bold text-[#0b1530]">Equity curve</div>
      <div className="mt-2 h-24 rounded-[10px] border border-[#e3eaf5] bg-[#fbfdff] p-2">
        <LineChart />
      </div>
    </Panel>
  );
}

function ControlsPanel() {
  return (
    <Panel title="Workflow controls">
      <div className="flex gap-3">
        <button className="rounded-[8px] bg-[#115dff] px-4 py-2 text-[12px] font-bold text-white">
          Run
        </button>
        {['Ⅱ', '◷', '…'].map((label) => (
          <button
            key={label}
            className="rounded-[8px] border border-[#dfe7f4] bg-white px-4 py-2 text-[12px] font-bold text-[#26314a]"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-[8px] border border-[#e3eaf5]">
        {[
          ['Load configuration', 'Complete', 'green'],
          ['Run simulation', '65%', 'blue'],
          ['Analyze results', 'Pending', 'gray'],
          ['Generate report', 'Pending', 'gray'],
        ].map(([step, state, tone]) => (
          <div
            key={step}
            className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#edf1f7] px-3 py-2 last:border-b-0"
          >
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#172033]">
              <span
                className={`h-3 w-3 rounded-full ${
                  tone === 'green'
                    ? 'bg-[#14a667]'
                    : tone === 'blue'
                      ? 'bg-[#115dff]'
                      : 'bg-[#aeb6c5]'
                }`}
              />
              {step}
            </div>
            <span className="text-[11px] text-[#4c5870]">{state}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function EnginePanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel title="Opened positions">
        <div className="space-y-2">
          {positions.map(([pair, side, pnl, tone]) => (
            <div
              key={pair}
              className="grid grid-cols-[1fr_auto] rounded-[8px] border border-[#e5ecf7] px-3 py-2"
            >
              <div>
                <div className="text-[11px] font-bold text-[#0b1530]">{pair}</div>
                <div className="text-[10px] text-[#0ca963]">
                  {side} <span className="font-bold">{pnl}</span>
                </div>
              </div>
              <span
                className={`mt-1 h-3 w-3 rounded-full ${tone === 'green' ? 'bg-[#0ca963]' : 'bg-[#f59e0b]'}`}
              />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Performance charts">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] font-bold text-[#34405a]">Equity curve</div>
            <div className="mt-1 h-17 rounded-[8px] border border-[#e5ecf7] p-2">
              <LineChart tone="green" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#34405a]">PnL</div>
            <div className="mt-1 h-17 rounded-[8px] border border-[#e5ecf7] p-2">
              <LineChart tone="red" />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function IntelligencePanel() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Win Rate', '38.9%'],
          ['Profit Factor', '1.07'],
          ['Follower PnL', '$47.2K'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[10px] border border-[#e3eaf5] bg-white p-4">
            <div className="text-[10px] font-medium text-[#58647d]">{label}</div>
            <div className="mt-2 text-[18px] font-black text-[#09132d]">{value}</div>
          </div>
        ))}
      </div>
      <Panel title="Trade PnL distribution">
        <BarDistribution />
      </Panel>
    </div>
  );
}

function LeaderboardPanel() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#dfe7f4] bg-white">
      <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] px-4 py-3 text-[10px] font-bold text-[#4d5870]">
        <div>Trader</div>
        <div>PnL</div>
        <div>Win Rate</div>
        <div>Profit Factor</div>
        <div>ACC PNL</div>
        <div>ACC In/Out</div>
      </div>
      {leaderboard.map(([name, pnl, win, factor, pnlTone, inOutTone], index) => (
        <div
          key={name}
          className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] items-center border-t border-[#edf1f7] px-4 py-3 text-[11px]"
        >
          <div className="flex items-center gap-2 font-bold text-[#0b1530]">
            <span className="h-6 w-6 rounded-full bg-[linear-gradient(135deg,#ffd4a6,#232c44)]" />
            {name}
          </div>
          <div className="font-bold text-[#0ca963]">{pnl}</div>
          <div>{win}</div>
          <div>{factor}</div>
          <TinySpark tone={pnlTone as 'blue' | 'green' | 'red'} offset={index} />
          <TinySpark tone={inOutTone as 'blue' | 'green' | 'red'} offset={index + 2} />
        </div>
      ))}
    </div>
  );
}

function TinySpark({ tone, offset = 0 }: { tone: 'blue' | 'green' | 'red'; offset?: number }) {
  const stroke = tone === 'green' ? '#0ca963' : tone === 'red' ? '#ff424c' : '#115dff';
  const points =
    offset % 2 === 0 ? '0,16 12,13 24,15 36,10 48,12 60,5' : '0,14 12,12 24,8 36,11 48,6 60,7';

  return (
    <svg aria-hidden="true" viewBox="0 0 60 20" className="h-6 w-16">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function PlatformPanel() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#dfe7f4] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f7] px-4 py-3">
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive', 'Archived'].map((tab) => (
            <span
              key={tab}
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                tab === 'Active'
                  ? 'bg-[#115dff] text-white'
                  : 'border border-[#dfe7f4] text-[#5b657b]'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <button className="rounded-[8px] border border-[#dfe7f4] px-3 py-1.5 text-[10px] font-bold text-[#115dff]">
          + New Contract
        </button>
      </div>
      <div className="grid grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.4fr] px-4 py-3 text-[10px] font-bold text-[#4d5870]">
        <div>Contract</div>
        <div>Chain ID</div>
        <div>Version</div>
        <div>Status</div>
        <div />
      </div>
      {contracts.map(([name, chain, version, status]) => (
        <div
          key={name}
          className="grid grid-cols-[1.4fr_0.7fr_0.8fr_0.8fr_0.4fr] border-t border-[#edf1f7] px-4 py-3 text-[11px] text-[#0b1530]"
        >
          <div>{name}</div>
          <div>{chain}</div>
          <div>{version}</div>
          <div
            className={
              status === 'Active' ? 'font-bold text-[#0ca963]' : 'font-bold text-[#f59e0b]'
            }
          >
            {status}
          </div>
          <div className="font-bold">…</div>
        </div>
      ))}
    </div>
  );
}

export function ProofSection() {
  return (
    <section
      id="features"
      aria-label="core product features preview"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)] px-4 py-16 md:px-8 lg:py-20"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,93,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(17,93,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-45" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(45,99,226,0.10),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(31,212,95,0.07),transparent_30%)]" />
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-4xl">
          <div className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#115dff]">
            Features
          </div>
          <h2 className="mt-4 text-[3rem] font-black leading-[0.98] tracking-[-0.055em] text-[#070d2b] md:text-[4.2rem] lg:text-[3.5rem]">
            Core product features
          </h2>
          <p className="mt-5 text-[18px] leading-8 text-[#3f4f70] md:text-[20px]">
            Powerful tools to simulate, analyze, and act with confidence.
          </p>
        </div>

        <div
          aria-label="responsive feature cards"
          className="mt-6 grid gap-4 xl:grid-cols-12 xl:items-stretch"
        >
          <FeatureCard
            number="1"
            title="Simulation workflow"
            body="Run simulations, track outcomes, and control execution."
            label="simulation workflow feature"
            className="xl:col-span-12"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <AutoSimulationPanel />
              <MetricsPanel />
              <ControlsPanel />
            </div>
          </FeatureCard>

          <FeatureCard
            number="2"
            title="Simulation engine"
            body="Backtest with positions, PnL, and performance charts."
            label="simulation engine feature"
            className="xl:col-span-6"
          >
            <EnginePanel />
          </FeatureCard>

          <FeatureCard
            number="3"
            title="Copy trading intelligence"
            body="Score traders, measure risk, and compare strategies."
            label="copy trading intelligence feature"
            className="xl:col-span-6"
          >
            <IntelligencePanel />
          </FeatureCard>

          <FeatureCard
            number="4"
            title="Leaderboard analysis"
            body="Find top performers with deep activity metrics."
            label="leaderboard analysis feature"
            className="xl:col-span-6"
          >
            <LeaderboardPanel />
          </FeatureCard>

          <FeatureCard
            number="5"
            title="Multi-platform architecture"
            body="Manage contracts, chain IDs, versions, and adaptation status."
            label="multi-platform architecture feature"
            className="xl:col-span-6"
          >
            <PlatformPanel />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
