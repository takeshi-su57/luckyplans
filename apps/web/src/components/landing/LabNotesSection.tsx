import Link from "next/link";
import { SectionContainer } from "./SectionContainer";

export function LabNotesSection() {
  return (
    <SectionContainer id="lab-notes">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
          Lab Notes
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          Weekly observations from building in the open.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-dashed border-neutral-300 p-8 text-center md:p-12">
        <p className="text-sm text-neutral-500">
          First entry publishing soon. Follow the repository for updates.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-600 transition-colors hover:text-green-700"
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
