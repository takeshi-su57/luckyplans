'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { normalizePages } from 'nextra/normalize-pages';

type PageMapItem = Parameters<typeof normalizePages>[0]['list'][number];

interface DocsSidebarProps {
  pageMap: PageMapItem[];
}

interface NormalizedPage {
  route: string;
  title: string;
  type?: string;
  children?: NormalizedPage[];
  frontMatter?: Record<string, unknown>;
}

function SidebarItem({
  item,
  pathname,
  depth = 0,
}: {
  item: NormalizedPage;
  pathname: string;
  depth?: number;
}) {
  const isActive = pathname === item.route;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className={depth > 0 ? 'ml-3' : ''}>
        <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {item.title}
        </p>
        <ul className="space-y-0.5">
          {item.children!.map((child) => (
            <SidebarItem key={child.route} item={child} pathname={pathname} depth={depth + 1} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <li>
      <Link
        href={item.route}
        className={`block rounded px-2 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-green-50 font-semibold text-green-700'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        {item.title}
      </Link>
    </li>
  );
}

export function DocsSidebar({ pageMap }: DocsSidebarProps) {
  const pathname = usePathname();
  const { directories } = normalizePages({ list: pageMap, route: pathname });

  return (
    <aside className="w-60 shrink-0 border-r border-neutral-200 px-4 py-10">
      <nav>
        {directories.map((item) => (
          <SidebarItem key={item.route} item={item as NormalizedPage} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
