'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { HOME_NAV_LINKS, homeNavLinkActive } from '../config/home-nav';

export function HomeQuickNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Shortcuts"
      className={cn(
        'flex flex-wrap gap-2 border-b border-border/60 pb-6',
        className
      )}
    >
      {HOME_NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = homeNavLinkActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'border-border bg-muted text-foreground'
                : 'border-transparent bg-muted/30 text-muted-foreground hover:border-border/80 hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
