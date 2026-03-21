'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gavel, FolderTree, Inbox } from 'lucide-react';

import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Gavel;
  exact?: boolean;
};

const NAV: NavItem[] = [
  {
    href: '/admin/auctions',
    label: 'All auctions',
    icon: Gavel,
    exact: true,
  },
  {
    href: '/admin/auctions/categories',
    label: 'Categories',
    icon: FolderTree,
  },
  {
    href: '/admin/auctions/requests',
    label: 'Requests',
    icon: Inbox,
  },
];

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminAuctionsSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="h-full">
      <div className="px-4 py-5 border-b border-border">
        <div className="text-sm font-bold text-foreground">Auctions</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Manage auctions & categories
        </div>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = isActivePath(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="size-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
