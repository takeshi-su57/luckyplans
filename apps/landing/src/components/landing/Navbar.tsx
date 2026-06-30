import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { appUrl, docsUrl } from '../../config/public-site-urls';

const navItems = [
  { label: 'Problem', href: '#problem' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Features', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
];
const navLinkClassName =
  'rounded-full px-3.5 py-2 text-[14px] font-medium text-[#1d2633]/76 transition-all duration-200 hover:bg-white/72 hover:text-[#07111f] hover:shadow-[0_8px_20px_rgba(9,18,48,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1fd45f]';
const mobileNavLinkClassName =
  'rounded-2xl border border-white/42 bg-white/64 px-4 py-3 text-sm font-medium text-[#172033] transition-colors hover:bg-white/86';
const appButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1fd45f_0%,#14b84f_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(31,212,95,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(31,212,95,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7ffd0]';

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
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto px-4 pt-3 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/18 bg-white/58 px-4 py-2.5 shadow-[0_18px_50px_rgba(5,12,23,0.16)] backdrop-blur-2xl md:px-5">
          <a href="#" aria-label="Back to top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-white/78 shadow-[0_10px_24px_rgba(29,56,128,0.08)]">
              <img
                src="/brand.png"
                alt="LuckyPlans"
                width={24}
                height={24}
                className="rounded-lg"
              />
            </span>
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-[-0.02em] text-[#131a25]">
                LuckyPlans
              </div>
              <div className="text-[9px] font-semibold tracking-[0.24em] text-[#4a5667] uppercase">
                Product preview
              </div>
            </div>
          </a>

          <div className="hidden items-center gap-1.5 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={navLinkClassName}>
                {item.label}
              </a>
            ))}
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={navLinkClassName}
            >
              Docs
            </a>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 ${appButtonClassName}`}
            >
              Open App
              <ArrowUpRight size={16} />
            </a>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-full border border-white/45 bg-white/68 px-4 py-2 text-sm font-semibold text-[#172033] backdrop-blur-md transition-colors hover:bg-white/86 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            Menu
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-4 mt-3 rounded-[30px] border border-white/14 bg-white/70 px-5 pb-5 pt-4 shadow-[0_18px_50px_rgba(5,12,23,0.16)] backdrop-blur-2xl md:mx-6 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={mobileNavLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={mobileNavLinkClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </a>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={appButtonClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              Open App
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
