'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HomeSellerPillProps {
  isSeller: boolean;
}

export function HomeSellerPill({ isSeller }: HomeSellerPillProps) {
  return (
    <div className="inline-flex w-full max-w-[248px] shrink-0 rounded-full border border-border/60 bg-muted/30 p-1 shadow-[var(--surface-shadow-sm)] lg:w-auto">
      <Link
        data-testid="home-seller-pill-home"
        href="/home"
        className={cn(
          'flex-1 rounded-full px-5 py-2 text-center text-[13px] font-semibold transition-all lg:flex-none',
          !isSeller
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Home
      </Link>
      <Link
        data-testid="home-seller-pill-seller"
        href="/seller/dashboard"
        className={cn(
          'flex-1 rounded-full px-5 py-2 text-center text-[13px] font-semibold transition-all lg:flex-none',
          isSeller
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Seller
      </Link>
    </div>
  );
}
