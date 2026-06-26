import { FinalCtaVisual } from './ProductVisuals';
import { SectionContainer } from './SectionContainer';

const docsUrl = 'https://docs.luckyplans.xyz';
const appUrl = 'https://app.luckyplans.xyz';

export function LabNotesSection() {
  return (
    <section className="overflow-hidden bg-[radial-gradient(circle_at_bottom_left,rgba(112,64,255,0.20),transparent_24%),radial-gradient(circle_at_top_right,rgba(45,99,226,0.24),transparent_26%),linear-gradient(135deg,#0f1630_0%,#121a38_56%,#1a234a_100%)] text-white">
      <SectionContainer id="cta" className="max-w-7xl py-24 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <h2 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Ready to make trading plans testable?
            </h2>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#c4d0ef]">
              Use real product visuals to invite early users into a simulation-first workflow for
              copy-trading research, scoring, and execution review.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#2d63e2] px-8 py-4 text-[18px] font-semibold text-white shadow-[0_10px_30px_rgba(45,99,226,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Open App
              </a>
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-8 py-4 text-[18px] font-semibold text-[#121a38] transition-colors hover:bg-[#eef3ff]"
              >
                Docs
              </a>
            </div>
          </div>

          <FinalCtaVisual />
        </div>
      </SectionContainer>
    </section>
  );
}
