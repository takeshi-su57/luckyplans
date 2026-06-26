import { PlatformVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

export function ChainsSection() {
  return (
    <SectionContainer id="platforms">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Multi-platform architecture</div>
        <h2 className="mt-4 text-5xl font-bold tracking-tight text-[#202630] md:text-6xl">
          Designed to manage platform contracts, chain IDs, versions, and adaptation status.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          Lucky Plans is not scoped to a single venue. The alpha product already includes platform
          management surfaces for contracts, versions, users, controls, and deployment state.
        </p>
      </div>

      <div className="mt-10">
        <PlatformVisual />
      </div>
    </SectionContainer>
  );
}
