'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { appNavItemActive, appNavRail } from '@/lib/app-design';
import { cn } from '@/lib/utils';

import { HOME_NAV_LINKS, homeNavLinkActive } from '../config/home-nav';

export function HomeLeftRail({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn(appNavRail(), className)}>
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Quick links
      </p>
      <nav className="flex flex-col gap-0.5" aria-label="Home shortcuts">
        {HOME_NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = homeNavLinkActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                active
                  ? appNavItemActive()
                  : 'text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground'
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
