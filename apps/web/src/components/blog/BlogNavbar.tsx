'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

export function BlogNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e7e4] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/blog" className="flex items-center gap-2">
          <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
          <span className="text-lg font-bold text-[#37352f]">
            Lucky<span className="text-[#0f7b6c]">Plans</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-[#787774] transition-colors hover:text-[#37352f]"
          >
            Back to app
          </Link>
          <a
            href="https://github.com/takeshi-su57/luckyplans"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View LuckyPlans on GitHub"
            className="text-[#787774] transition-colors hover:text-[#37352f]"
          >
            <GitHubIcon size={20} />
          </a>
          <Link
            href="/docs"
            className="rounded-lg border border-[#e8e7e4] bg-[#fbfbfa] px-3 py-2 text-sm font-medium text-[#37352f] transition-colors hover:bg-white"
          >
            Docs
          </Link>
        </div>
      </div>
    </nav>
  );
}
