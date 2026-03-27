import Image from 'next/image';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

export function DocsNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e7e4] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
          <span className="text-lg font-bold text-[#37352f]">
            Lucky<span className="text-[#0f7b6c]">Plans</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-[#787774] transition-colors hover:text-[#37352f]"
          >
            Home
          </Link>
          <a
            href="https://github.com/takeshi-su57/lucky-plan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#787774] transition-colors hover:text-[#37352f]"
          >
            <GitHubIcon size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}
