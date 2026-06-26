import { RoadmapVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function TeamSection() {
  return (
    <SectionContainer id="roadmap">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Simple roadmap</div>
        <h2 className="mt-4 text-5xl font-bold tracking-tight text-[#202630] md:text-6xl">
          Stage-based progress for a transparent first public release.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          The first public story should be explicit about what exists now, what is being prepared,
          and what still belongs in the future.
        </p>
      </div>

      <div className="mt-16">
        <RoadmapVisual />
      </div>
    </SectionContainer>
  );
}
