import { Bell } from 'lucide-react';

const blogUrl = '/blog';
const githubUrl = 'https://github.com/takeshi-su57/luckyplans';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-5 py-12 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(45,99,226,0.12),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(127,53,216,0.12),transparent_24%)]" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="rounded-[28px] border border-[#d9e3f4] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(247,250,255,0.88)_46%,rgba(244,239,255,0.9)_100%)] px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8 md:flex md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <img
                src="/brand.png"
                alt="LuckyPlans"
                width={48}
                height={48}
                className="rounded-2xl shadow-[0_12px_30px_rgba(45,99,226,0.12)]"
              />
              <span className="text-[28px] font-black tracking-[-0.04em] text-[#071126]">
                LuckyPlans
              </span>
            </div>
            <p className="mt-4 max-w-md text-[17px] leading-8 text-[#4f5f79]">
              Build, test, and review copy-trading plans with real simulation workflows.
            </p>
            <p className="mt-6 text-sm text-[#66728d]">© 2026 LuckyPlans. All rights reserved.</p>
          </div>

          <div className="mt-8 flex items-center gap-4 md:mt-0">
            <a
              href={blogUrl}
              aria-label="Updates"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-[#7ea0ff] bg-white/76 text-[#2d63e2] shadow-[0_14px_34px_rgba(45,99,226,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2d63e2] hover:bg-white hover:shadow-[0_18px_44px_rgba(45,99,226,0.18)]"
            >
              <Bell size={28} />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/82 text-[#071126] shadow-[0_14px_34px_rgba(15,23,42,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#071126] hover:bg-white hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)]"
            >
              <GitHubMark />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M12 .5C5.65.5.5 5.77.5 12.26c0 5.2 3.29 9.6 7.86 11.16.58.1.79-.25.79-.57v-2.18c-3.2.71-3.87-1.4-3.87-1.4-.52-1.36-1.28-1.72-1.28-1.72-1.05-.74.08-.73.08-.73 1.16.08 1.77 1.22 1.77 1.22 1.03 1.8 2.71 1.28 3.37.98.1-.76.4-1.28.73-1.58-2.55-.3-5.23-1.31-5.23-5.82 0-1.29.45-2.34 1.19-3.16-.12-.3-.52-1.5.11-3.12 0 0 .98-.32 3.18 1.2a10.8 10.8 0 0 1 5.8 0c2.2-1.52 3.18-1.2 3.18-1.2.63 1.62.23 2.82.11 3.12.74.82 1.19 1.87 1.19 3.16 0 4.52-2.69 5.52-5.25 5.81.42.37.78 1.09.78 2.2v3.22c0 .32.21.68.8.57A11.77 11.77 0 0 0 23.5 12.26C23.5 5.77 18.35.5 12 .5Z" />
    </svg>
  );
}
