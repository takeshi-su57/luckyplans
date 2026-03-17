'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Docs', href: '/docs' },
];

export function AppNavbar() {
  const { user, isLoading, error } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }, []);

  useEffect(() => {
    if (error && !isLoading) {
      window.location.href = '/login?returnTo=' + window.location.pathname;
    }
  }, [error, isLoading]);

  const displayName = user?.name || user?.email || 'User';

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
            <span className="text-lg font-bold text-neutral-900">
              Lucky<span className="text-green-600">Plans</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isLoading ? (
            <span className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
          ) : user ? (
            <>
              <span className="text-sm text-neutral-600">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
              >
                Log out
              </button>
            </>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="text-neutral-500 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-neutral-200 bg-white/95 px-6 pb-6 pt-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg text-neutral-700 transition-colors hover:text-neutral-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <div className="mt-2 flex flex-col gap-3 border-t border-neutral-200 pt-4">
                <span className="text-sm text-neutral-500">{displayName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg border border-neutral-300 px-4 py-3 text-center text-lg font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
