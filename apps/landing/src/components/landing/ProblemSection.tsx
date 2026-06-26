import { ProblemVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function ProblemSection() {
  return (
    <SectionContainer id="problem">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">The problem</div>
        <h2 className="mt-4 text-5xl font-bold tracking-tight text-[#202630] md:text-6xl">
          Blind copy trading hides risk.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          A trader can look profitable while drawdown, timing, leverage, and execution details tell
          a different story.
        </p>
      </div>

      <div className="mt-10">
        <ProblemVisual />
      </div>
    </SectionContainer>
  );
}
