'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AppSidebar } from './app-sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar — hidden on mobile unless menu is open */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-200 ${
          collapsed ? 'lg:pl-13' : 'lg:pl-60'
        }`}
      >
        {/* Mobile header — Notion style: minimal, no heavy border */}
        <div className="sticky top-0 z-20 flex h-11 items-center justify-between bg-white px-3 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/brand.png" alt="LuckyPlans" width={20} height={20} />
            <span className="text-sm font-semibold text-[#37352f]">
              Lucky<span className="text-primary">Plans</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-7 items-center justify-center rounded text-[#787774] hover:bg-[#f1f1ef]"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {/* Content — centered like Notion */}
        <main className="mx-auto w-full max-w-6xl px-10 py-8 max-lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
