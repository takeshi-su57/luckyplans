import { Map } from 'lucide-react';
import { RoadmapVisual } from './ProductVisuals';

export function TeamSection() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(45,99,226,0.10),transparent_28%),radial-gradient(circle_at_88%_6%,rgba(255,255,255,0.92),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[61%] top-0 hidden h-97.5 w-155 opacity-70 lg:block">
        <svg viewBox="0 0 620 420" className="h-full w-full" aria-hidden="true">
          <path
            d="M60 322 C118 170 164 72 286 70 C392 68 438 110 620 24"
            fill="none"
            stroke="#d7e2f7"
            strokeWidth="2"
          />
          <path
            d="M0 410 C94 214 132 120 284 126 C414 132 462 178 620 96"
            fill="none"
            stroke="#dbe6fa"
            strokeWidth="2"
          />
          <circle cx="132" cy="132" r="7" fill="#ffffff" stroke="#bfd3ff" strokeWidth="2" />
          <circle cx="176" cy="54" r="7" fill="#eef5ff" stroke="#dbe6fa" strokeWidth="2" />
        </svg>
      </div>
      <div className="pointer-events-none absolute left-[58%] top-0 hidden h-28 w-40 bg-[radial-gradient(circle,#b8caff_1.5px,transparent_1.5px)] bg-size-[22px_22px] opacity-45 lg:block" />
      <div
        aria-label="roadmap status legend"
        className="absolute right-[6vw] top-65 hidden rounded-full border border-[#d6e1f5] bg-white/62 px-7 py-4 shadow-[0_16px_44px_rgba(45,99,226,0.08)] backdrop-blur-xl xl:flex"
      >
        <div className="flex gap-6">
          <span className="h-4 w-4 rounded-full bg-[#2d63e2]" />
          <span className="h-4 w-4 rounded-full bg-[#8733df]" />
          <span className="h-4 w-4 rounded-full bg-[#19a865]" />
          <span className="h-4 w-4 rounded-full bg-[#ed9400]" />
        </div>
      </div>

      <div className="relative w-full px-6 py-18 sm:px-10 lg:px-[6vw] lg:py-20 xl:px-[6vw]">
        <div className="max-w-280">
          <div className="flex items-center gap-5 text-xl font-bold tracking-[-0.02em] text-[#2d63e2]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#2d63e2]">
              <Map size={24} strokeWidth={2.2} />
            </span>
            Simple roadmap
          </div>
          <h2 className="mt-8 max-w-270 text-[3.25rem] font-black leading-[1.08] tracking-[-0.052em] text-[#071126] md:text-[3.9rem] xl:text-[3.5rem] 2xl:text-[3.5rem]">
            Stage-based progress for a transparent first public release.
          </h2>
          <p className="mt-7 max-w-205 text-[1.3rem] leading-9 text-[#647190]">
            The first public story should be explicit about what exists now, what is being prepared,
            and what still belongs in the future.
          </p>
        </div>

        <div className="mt-14">
          <RoadmapVisual />
        </div>
      </div>
    </section>
  );
}
