'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ADMIN_DASHBOARD_QUICK_LINKS } from '../config/admin-dashboard-links';

function linkActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === '/admin/users') return pathname === '/admin/users';
  if (href === '/admin/sellers') {
    return pathname.startsWith('/admin/sellers');
  }
  if (href === '/admin/auctions/requests') {
    return pathname.includes('/admin/auctions/requests');
  }
  if (href === '/admin/auctions') {
    return (
      pathname.startsWith('/admin/auctions') && !pathname.includes('/requests')
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Primary navigation for the admin hub — compact on small screens, sticky column on large.
 */
export function AdminDashboardRail() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile / tablet: horizontal snap strip */}
      <nav
        aria-label="Admin sections"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {ADMIN_DASHBOARD_QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          const active = linkActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors',
                active
                  ? 'border-foreground/20 bg-foreground text-background'
                  : 'border-border/80 bg-card/90 text-foreground hover:bg-muted/80'
              )}
            >
              <Icon className="size-3.5 opacity-90" aria-hidden />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Desktop: vertical stack */}
      <nav
        aria-label="Admin sections"
        className="hidden lg:block lg:sticky lg:top-6"
      >
        <div className="rounded-2xl border border-border/70 bg-card/85 p-2 shadow-sm backdrop-blur-md">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <ul className="flex flex-col gap-0.5">
            {ADMIN_DASHBOARD_QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              const active = linkActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background/60',
                        active
                          ? 'border-primary-foreground/20 text-primary-foreground'
                          : 'border-border/60 text-foreground'
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium leading-none">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          'mt-1 line-clamp-2 text-[11px] leading-snug',
                          active
                            ? 'text-primary-foreground/85'
                            : 'text-muted-foreground group-hover:text-foreground/80'
                        )}
                      >
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        'size-4 shrink-0 opacity-0 transition-opacity',
                        active
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground group-hover:opacity-70'
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
