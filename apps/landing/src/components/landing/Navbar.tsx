import { useEffect, useState } from 'react';

const docsUrl = 'https://docs.luckyplans.xyz';
const appUrl = 'https://app.luckyplans.xyz';

const navItems = [
  { label: 'Problem', href: '#problem' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Features', href: '#features' },
  { label: 'Engine', href: '#engine' },
  { label: 'Security', href: '#security' },
  { label: 'Roadmap', href: '#roadmap' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nextVisible = window.scrollY > 36;
      setIsVisible(nextVisible);

      if (!nextVisible) {
        setIsMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto px-4 pt-3 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/10 bg-[rgba(238,243,251,0.52)] px-6 py-4 shadow-[0_16px_40px_rgba(9,18,48,0.12)] backdrop-blur-2xl md:px-8">
        <a href="#" aria-label="Back to top" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/45 bg-white/72 shadow-[0_10px_30px_rgba(29,56,128,0.08)]">
            <img src="/brand.png" alt="LuckyPlans" width={28} height={28} className="rounded-lg" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
              LuckyPlans
            </div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-default-500 uppercase">
              Product preview
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-default-600 transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-default-600 transition-colors hover:text-foreground"
          >
            Docs
          </a>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-2xl border border-[#1f56da] bg-[#2d63e2] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,99,226,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#2457d3]"
          >
            Open App
          </a>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="rounded-xl border border-white/35 bg-white/60 px-3 py-2 text-default-700 backdrop-blur-md lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          Menu
        </button>
      </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/10 bg-[rgba(238,243,251,0.72)] px-6 pb-5 pt-4 shadow-[0_16px_40px_rgba(9,18,48,0.12)] backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm font-medium text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </a>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#2d63e2] px-4 py-3 text-sm font-semibold text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Open App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
