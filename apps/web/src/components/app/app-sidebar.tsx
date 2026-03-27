'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Avatar } from '@heroui/react';
import {
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Docs', href: '/docs', icon: BookOpen },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function AppSidebar({ collapsed, onToggle, onNavigate }: AppSidebarProps) {
  const { user, isLoading } = useCurrentUser();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }, []);

  const displayName = user?.name || user?.email || 'User';

  return (
    <aside
      className={`flex h-full flex-col bg-[#f7f6f3] transition-all duration-200 ${
        collapsed ? 'w-[52px]' : 'w-60'
      }`}
    >
      {/* Header */}
      <div className={`flex h-11 items-center ${collapsed ? 'justify-center' : 'justify-between px-3'}`}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/brand.png" alt="LuckyPlans" width={20} height={20} />
            <span className="text-sm font-semibold text-[#37352f]">
              Lucky<span className="text-primary">Plans</span>
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="flex size-6 items-center justify-center rounded text-[#a6a299] transition-colors hover:bg-[#f1f1ef] hover:text-[#37352f]"
        >
          {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-0.5 ${collapsed ? 'px-1.5' : 'px-2'} py-2`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#f1f1ef] font-medium text-[#37352f]'
                  : 'text-[#787774] hover:bg-[#f1f1ef] hover:text-[#37352f]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="size-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={`${collapsed ? 'px-1.5' : 'px-2'} pb-3`}>
        {/* Settings link */}
        <Link
          href="/profile"
          onClick={onNavigate}
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-[#787774] transition-colors hover:bg-[#f1f1ef] hover:text-[#37352f] ${collapsed ? 'justify-center' : ''}`}
        >
          <Settings className="size-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* User */}
        {!isLoading && user && (
          <div
            className={`mt-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Avatar className="size-6 text-[10px]">
              {user.avatarUrl ? (
                <Avatar.Image src={`/uploads/${user.avatarUrl}`} alt={displayName} />
              ) : null}
              <Avatar.Fallback>{displayName.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[#37352f]">{displayName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="flex size-6 items-center justify-center rounded text-[#a3a29e] opacity-0 transition-all hover:bg-[#f1f1ef] hover:text-[#37352f] group-hover:opacity-100"
                  style={{ opacity: 1 }}
                >
                  <LogOut className="size-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
