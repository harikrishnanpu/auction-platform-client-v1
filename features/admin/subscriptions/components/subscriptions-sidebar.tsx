'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BadgeCheck, Layers, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  {
    href: '/admin/subscriptions',
    label: 'All subscriptions',
    icon: Layers,
    exact: true,
  },
  {
    href: '/admin/subscriptions/features',
    label: 'Features',
    icon: BadgeCheck,
  },
  {
    href: '/admin/subscriptions/users',
    label: 'Subscribed users',
    icon: Users,
  },
];

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSubscriptionsSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="h-full">
      <div className="px-4 py-5 border-b border-border">
        <div className="text-sm font-bold text-foreground">Subscriptions</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Plans, features and users
        </div>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href, item.exact);
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
