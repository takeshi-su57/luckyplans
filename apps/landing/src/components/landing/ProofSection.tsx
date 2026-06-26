import { SectionContainer } from './SectionContainer';
import {
  AnalyzeResultsVisual,
  AutoSimulationListVisual,
  WorkflowControlsVisual,
} from './ProductVisuals';

export function ProofSection() {
  return (
    <SectionContainer id="features">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Simulation workflow</div>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#202630] md:text-5xl">
          Track simulations, summarize outcomes, and control plan execution.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#66728d]">
          These are not abstract concepts. The product already exposes accepted, running, and
          completed simulations alongside result metrics and operator controls.
        </p>
      </div>

      <div className="mt-12 grid gap-10 xl:grid-cols-2">
        <div className="xl:col-span-2">
          <h3 className="text-[30px] font-bold tracking-tight text-[#202630]">
            Auto simulation list
          </h3>
          <p className="mt-2 text-base leading-7 text-[#66728d]">
            Track accepted, running, and completed simulations.
          </p>
          <div className="mt-6">
            <AutoSimulationListVisual />
          </div>
        </div>

        <div>
          <h3 className="text-[30px] font-bold tracking-tight text-[#202630]">Result metrics</h3>
          <p className="mt-2 text-base leading-7 text-[#66728d]">
            Summarize PnL, trades, win rate, and profit factor.
          </p>
          <div className="mt-6">
            <AnalyzeResultsVisual />
          </div>
        </div>

        <div>
          <h3 className="text-[30px] font-bold tracking-tight text-[#202630]">Workflow controls</h3>
          <p className="mt-2 text-base leading-7 text-[#66728d]">
            Resume, cancel, remove, and inspect simulation plans from one place.
          </p>
          <div className="mt-6">
            <WorkflowControlsVisual />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
