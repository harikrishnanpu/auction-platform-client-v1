'use client';

import type { ReactNode } from 'react';

import type { IAuctionDto } from '@/types/auction.type';
import {
  SellerAuctionCard,
  SellerAuctionCardSkeleton,
} from '@/features/seller/auction/components/seller-auction-card';
import { cn } from '@/lib/utils';

function sortAuctionsByStartDesc(auctions: IAuctionDto[]): IAuctionDto[] {
  return [...(auctions ?? [])].sort((a, b) => {
    const aTime = new Date(String(a.startAt)).getTime();
    const bTime = new Date(String(b.startAt)).getTime();
    return (
      (Number.isFinite(bTime) ? bTime : 0) -
      (Number.isFinite(aTime) ? aTime : 0)
    );
  });
}

export interface UserAuctionsCardsProps {
  auctions: IAuctionDto[];
  limit?: number;
  className?: string;
  emptyAction?: ReactNode;
  sortMode?: 'client' | 'none';
}

export function UserAuctionsCards({
  auctions,
  limit,
  className,
  emptyAction,
  sortMode = 'client',
}: UserAuctionsCardsProps) {
  const sorted =
    sortMode === 'client' ? sortAuctionsByStartDesc(auctions) : auctions;
  const rows = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 px-4 py-10 text-center',
          className
        )}
      >
        <p className="text-sm font-medium text-foreground">No auctions yet</p>
        <p className="mt-1 max-w-xs text-[11px] text-muted-foreground">
          Try adjusting your filters.
        </p>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {rows.map((a) => (
        <SellerAuctionCard key={a.id} auction={a} href={`/auction/${a.id}`} />
      ))}
    </div>
  );
}

export function UserAuctionsCardsSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SellerAuctionCardSkeleton key={i} />
      ))}
    </div>
  );
}
