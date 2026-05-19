'use client';

import type { ReactNode } from 'react';

import type { IAuctionDto } from '@/types/auction.type';
import {
  AuctionCard,
  AuctionCardSkeleton,
} from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
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
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center',
          className
        )}
      >
        <p className="text-base font-semibold text-foreground">
          No auctions found
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting your filters or search term.
        </p>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <AuctionListingGrid variant="listing" className={className}>
      {rows.map((a) => (
        <AuctionCard key={a.id} auction={a} href={`/auction/${a.id}`} />
      ))}
    </AuctionListingGrid>
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
    <AuctionListingGrid variant="listing" className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </AuctionListingGrid>
  );
}
