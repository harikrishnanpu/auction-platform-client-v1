'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Gavel, LayoutDashboard } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/auctions', label: 'All auctions', icon: Gavel },
  { href: '/seller/payments', label: 'Payments', icon: CreditCard },
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
      <aside className="shrink-0 border-b border-border bg-background px-4 py-3 sm:w-[220px] sm:border-b-0 sm:border-r sm:py-6">
        <p className="mb-2 hidden px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:block">
          Seller
        </p>
        <nav
          className="flex gap-1 overflow-x-auto rounded-xl bg-muted/60 p-1.5 sm:flex-col sm:overflow-visible"
          aria-label="Seller navigation"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = navActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                  active
                    ? 'border border-border bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
