import Link from "next/link";
import { SectionContainer } from "./SectionContainer";

export function LabNotesSection() {
  return (
    <SectionContainer id="lab-notes">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#37352f] md:text-3xl">
          Lab Notes
        </h2>
        <p className="max-w-2xl text-base text-[#787774]">
          Weekly observations from building in the open.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-dashed border-[#e8e7e4] p-8 text-center md:p-12">
        <p className="text-sm text-[#787774]">
          First entry publishing soon. Follow the repository for updates.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0f7b6c] transition-colors hover:text-[#0f7b6c]"
        >
          View all notes
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </SectionContainer>
  );
}
