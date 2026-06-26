import { IntelligenceVisual, LeaderboardVisual, SimulationEngineVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function BuildersSection() {
  return (
    <SectionContainer id="engine">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Simulation engine</div>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#202630] md:text-5xl">
          Backtest follower behavior, accumulated PnL, and risk exposure before live copy
          execution.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#66728d]">
          The engine is where accumulated PnL, in-and-out curves, opened positions, and per-trade
          distributions become concrete enough to judge before capital is at risk.
        </p>
      </div>

      <div className="mt-10">
        <SimulationEngineVisual />
      </div>

      <div className="mt-16 grid gap-12 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <div className="max-w-3xl">
          <div className="text-lg font-semibold text-[#2d63e2]">Copy trading intelligence</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#202630] md:text-5xl">
            Default copy is not always the best copy.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#66728d]">
            Score leader behavior before choosing a strategy, compare alternative copy modes, and
            use distribution-level evidence rather than narrative confidence.
          </p>
        </div>
        <IntelligenceVisual />
      </div>

      <div className="mt-16 grid gap-12 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <div className="max-w-3xl">
          <div className="text-lg font-semibold text-[#2d63e2]">Leaderboard analysis</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#202630] md:text-5xl">
            Find traders worth deeper simulation with platform filters and activity metrics.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#66728d]">
            Filtering and analysis are part of the product truth already visible in alpha, so the
            landing story should show those tools as a first-class research surface.
          </p>
        </div>
        <LeaderboardVisual />
      </div>
    </SectionContainer>
  );
}
