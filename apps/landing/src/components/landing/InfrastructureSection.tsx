import { SolutionVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function InfrastructureSection() {
  return (
    <SectionContainer id="workflow">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#16a165]">The solution</div>
        <h2 className="mt-4 text-5xl font-bold tracking-tight text-[#202630] md:text-6xl">
          Plan, simulate, then decide.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          Lucky Plans organizes copy-trading research into simulations, plans, metrics, and
          reviewable results.
        </p>
      </div>

      <div className="mt-12">
        <SolutionVisual />
      </div>
    </SectionContainer>
  );
}
