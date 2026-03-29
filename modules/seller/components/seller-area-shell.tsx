'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Gavel, LayoutDashboard } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/auctions', label: 'All auctions', icon: Gavel },
  { href: '/seller/payments', label: 'All payments', icon: CreditCard },
] as const;

function navActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === '/seller/dashboard') return pathname === '/seller/dashboard';
  if (href === '/seller/payments') return pathname === '/seller/payments';
  if (href === '/seller/auctions') {
    return (
      pathname === '/seller/auctions' || pathname.startsWith('/seller/auction')
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SellerAreaShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideShell =
    pathname === '/seller/landing' || pathname?.startsWith('/seller/kyc');

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-background sm:flex-row">
      <nav
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-border/60 bg-card/20 px-3 py-2 sm:w-52 sm:flex-col sm:border-b-0 sm:border-r sm:py-4"
        aria-label="Seller navigation"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = navActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
