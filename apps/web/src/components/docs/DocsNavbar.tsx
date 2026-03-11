import Image from 'next/image';
import Link from 'next/link';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

export function DocsNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
          <span className="text-lg font-bold text-neutral-900">
            Lucky<span className="text-green-600">Plans</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Home
          </Link>
          <a
            href="https://github.com/takeshi-su57/lucky-plan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <GitHubIcon size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}
