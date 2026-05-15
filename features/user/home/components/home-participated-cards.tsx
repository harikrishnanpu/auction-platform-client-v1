import { AuctionCard } from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
import { ParticipationPill } from '@/features/user/home/components/participation-pill';
import type { IAuctionDto } from '@/types/auction.type';
import { ReactNode } from 'react';

export interface HomeParticipatedCardsProps {
  auctions: IAuctionDto[];
  limit?: number;
  empty: ReactNode;
}

export function HomeParticipatedCards({
  auctions,
  limit,
  empty,
}: HomeParticipatedCardsProps) {
  if (!auctions || auctions.length === 0) {
    return <>{empty}</>;
  }

  const rows = typeof limit === 'number' ? auctions.slice(0, limit) : auctions;

  return (
    <AuctionListingGrid variant="homeWide">
      {rows.map((auction) => (
        <div key={auction.id} className="relative min-w-0">
          {auction.participation ? (
            <div className="pointer-events-none absolute left-2 top-2 z-20 flex flex-wrap gap-1">
              <ParticipationPill>
                {auction.participation.label}
              </ParticipationPill>
            </div>
          ) : null}
          <AuctionCard auction={auction} href={`/auction/${auction.id}`} />
        </div>
      ))}
    </AuctionListingGrid>
  );
}
