import type { ReactNode } from 'react';
import Link from 'next/link';
import type { IAuctionDto } from '@/types/auction.type';

import {
  AuctionCard,
  AuctionCardSkeleton,
} from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
import { Button } from '@/components/ui/button';
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

export interface SellerAuctionsCardsProps {
  auctions: IAuctionDto[];
  limit?: number;
  className?: string;
  emptyAction?: ReactNode;
  sortMode?: 'client' | 'none';
}

export function SellerAuctionsCards({
  auctions,
  limit,
  className,
  emptyAction,
  sortMode = 'client',
}: SellerAuctionsCardsProps) {
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
          Create a listing to see it here with schedule and pricing.
        </p>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <AuctionListingGrid className={className}>
      {rows.map((a) => (
        <AuctionCard
          key={a.id}
          auction={a}
          href={`/seller/auctions/${a.id}`}
          ctaLabel="Manage listing"
        />
      ))}
    </AuctionListingGrid>
  );
}

export interface SellerAuctionsCardsSkeletonProps {
  count?: number;
  className?: string;
}

export function SellerAuctionsCardsSkeleton({
  count = 5,
  className,
}: SellerAuctionsCardsSkeletonProps) {
  return (
    <AuctionListingGrid className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </AuctionListingGrid>
  );
}

/** Optional CTA styled for empty state */
export function SellerAuctionsEmptyCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button asChild className="rounded-xl">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
