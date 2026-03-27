'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button, Skeleton } from '@heroui/react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Docs', href: '/docs' },
];

export function AppNavbar() {
  const { user, isLoading } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }, []);

  const displayName = user?.name || user?.email || 'User';

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e7e4] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
            <span className="text-lg font-bold text-[#37352f]">
              Lucky<span className="text-primary">Plans</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#787774] transition-colors hover:text-[#37352f]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isLoading ? (
            <Skeleton className="h-4 w-24 rounded-lg" />
          ) : user ? (
            <>
              <span className="text-sm text-[#787774]">{displayName}</span>
              <Button variant="outline" size="sm" onPress={handleLogout}>
                Log out
              </Button>
            </>
          ) : null}
        </div>

        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden"
          onPress={() => setIsMenuOpen(!isMenuOpen)}
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
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#e8e7e4] bg-white/95 px-6 pb-6 pt-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg text-[#37352f] transition-colors hover:text-[#37352f]"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <div className="mt-2 flex flex-col gap-3 border-t border-[#e8e7e4] pt-4">
                <span className="text-sm text-[#787774]">{displayName}</span>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onPress={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
