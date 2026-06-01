'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HomeSellerPillProps {
  isSeller: boolean;
}

export function HomeSellerPill({ isSeller }: HomeSellerPillProps) {
  return (
    <div className="inline-flex w-full max-w-[240px] shrink-0 rounded-full border border-border bg-muted/40 p-0.5 lg:w-auto">
      <Link
        data-testid="home-seller-pill-home"
        href="/home"
        className={cn(
          'flex-1 rounded-full px-4 py-1.5 text-center text-[13px] font-semibold transition-colors lg:flex-none lg:px-5',
          !isSeller
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Home
      </Link>
      <Link
        data-testid="home-seller-pill-seller"
        href="/seller/dashboard"
        className={cn(
          'flex-1 rounded-full px-4 py-1.5 text-center text-[13px] font-semibold transition-colors lg:flex-none lg:px-5',
          isSeller
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Seller
      </Link>
    </div>
  );
}
