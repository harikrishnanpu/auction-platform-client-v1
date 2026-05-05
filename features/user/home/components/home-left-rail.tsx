'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  Gavel,
  Handshake,
  Home,
  LayoutGrid,
  UserRound,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/auctions', label: 'Browse auctions', icon: LayoutGrid },
  { href: '/profile/my-auctions', label: 'My auctions', icon: Handshake },
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/profile/subscription', label: 'Subscription', icon: Crown },
  { href: '/seller/landing', label: 'Seller hub', icon: Gavel },
] as const;

export function HomeLeftRail({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'rounded-[12px] border border-border/80 bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Quick links
      </p>
      <nav className="flex flex-col gap-0.5" aria-label="Home shortcuts">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = (() => {
            if (href === '/home') return pathname === '/home';
            if (href === '/profile/my-auctions') {
              return (
                pathname === '/profile/my-auctions' ||
                pathname.startsWith('/profile/my-auctions/')
              );
            }
            if (href === '/profile/subscription') {
              return (
                pathname === '/profile/subscription' ||
                pathname.startsWith('/profile/subscription/')
              );
            }
            if (href === '/profile') {
              if (pathname === '/profile') return true;
              if (!pathname.startsWith('/profile/')) return false;
              if (pathname.startsWith('/profile/my-auctions')) return false;
              if (pathname.startsWith('/profile/subscription')) return false;
              return true;
            }
            return pathname === href || pathname.startsWith(`${href}/`);
          })();
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#f5f5f5] text-foreground dark:bg-muted'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
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
