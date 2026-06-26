import { SectionContainer } from './SectionContainer';
import { TrustVisual } from './ProductVisuals';

export function PrinciplesSection() {
  return (
    <SectionContainer id="security">
      <div className="max-w-4xl">
        <div className="text-lg font-semibold text-[#2d63e2]">Trust and official access</div>
        <h2 className="mt-4 text-5xl font-bold tracking-tight text-[#202630] md:text-6xl">
          Use clear official links, verified channels, and controlled environments for safer
          onboarding.
        </h2>
        <p className="mt-5 text-xl leading-9 text-[#66728d]">
          We should avoid pretending a full trust layer already exists, but we can still make the
          onboarding message safer and clearer with an explicit checklist and environment framing.
        </p>
      </div>

      <div className="mt-10">
        <TrustVisual />
      </div>
    </SectionContainer>
  );
}
