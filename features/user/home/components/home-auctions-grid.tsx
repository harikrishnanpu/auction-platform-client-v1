import type { ReactNode } from 'react';

import { AuctionCard } from '@/features/auction/components/auction-card';
import {
  AuctionListingGrid,
  type AuctionListingGridVariant,
} from '@/features/auction/components/auction-listing-grid';
import type { IAuctionDto } from '@/types/auction.type';

export interface HomeAuctionsGridProps {
  auctions: IAuctionDto[];
  limit?: number;
  empty: ReactNode;
  gridVariant?: AuctionListingGridVariant;
}

export function HomeAuctionsGrid({
  auctions,
  limit,
  empty,
  gridVariant = 'home',
}: HomeAuctionsGridProps) {
  if (!auctions || auctions.length === 0) {
    return <>{empty}</>;
  }

  const rows = typeof limit === 'number' ? auctions.slice(0, limit) : auctions;

  return (
    <AuctionListingGrid variant={gridVariant}>
      {rows.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
          href={`/auction/${auction.id}`}
        />
      ))}
    </AuctionListingGrid>
  );
}
