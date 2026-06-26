import { AnalyzeResultsVisual, DiscoverTradersVisual, GeneratePlansVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function StatsSection() {
  return (
    <SectionContainer id="overview">
      <div className="max-w-3xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Core workflow</div>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#202630] md:text-5xl">
          Discover traders, generate plans, and analyze results in one system.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          The alpha product already exposes the real operating loop: filter leaders, build
          simulation plans, and review PnL, trades, win rate, and profit factor before live copy.
        </p>
      </div>

      <div className="mt-14 grid gap-14">
        <div>
          <h3 className="text-[38px] font-bold tracking-tight text-[#202630]">Discover traders</h3>
          <p className="mt-3 text-xl text-[#66728d]">
            Filter leader histories before deeper testing.
          </p>
          <div className="mt-8">
            <DiscoverTradersVisual />
          </div>
        </div>

        <div>
          <h3 className="text-[38px] font-bold tracking-tight text-[#202630]">Generate plans</h3>
          <p className="mt-3 text-xl text-[#66728d]">
            Create reusable simulation windows and bot plans.
          </p>
          <div className="mt-8">
            <GeneratePlansVisual />
          </div>
        </div>

        <div>
          <h3 className="text-[38px] font-bold tracking-tight text-[#202630]">Analyze results</h3>
          <p className="mt-3 text-xl text-[#66728d]">
            Review PnL, drawdown, trades, and profit factor.
          </p>
          <div className="mt-8">
            <AnalyzeResultsVisual />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
