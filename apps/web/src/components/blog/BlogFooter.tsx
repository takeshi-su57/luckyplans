import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

export function BlogFooter() {
  return (
    <footer className="border-t border-[#e8e7e4] bg-[#fbfbfa]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-[#787774] md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-medium text-[#37352f]">LuckyPlans Lab Notes</p>
          <p>Build notes, release context, and engineering observations from the product team.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/docs" className="transition-colors hover:text-[#37352f]">
            Docs
          </Link>
          <a
            href="https://github.com/takeshi-su57/luckyplans"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[#37352f]"
          >
            <GitHubIcon size={14} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
