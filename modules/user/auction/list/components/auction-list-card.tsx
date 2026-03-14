'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AuctionStatusBadge } from '@/components/auction/auction-status-badge';
import { AuctionTypeBadge } from '@/components/auction/auction-type-badge';
import { getAuctionImageUrl, getBrowseStatusLabel } from '@/lib/auction-utils';
import type { BrowseAuctionListItem } from '@/types/auction.type';

export interface AuctionListCardProps {
  auction: BrowseAuctionListItem;
}

export function AuctionListCard({ auction }: AuctionListCardProps) {
  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className="overflow-hidden rounded-2xl hover:shadow-lg transition-shadow h-full">
        <div className="aspect-[4/3] bg-muted relative">
          <img
            src={getAuctionImageUrl(auction.primaryImageKey)}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 right-2">
            <AuctionStatusBadge
              status={auction.status}
              label={getBrowseStatusLabel(auction.status)}
              variant={
                auction.status === 'ACTIVE'
                  ? 'default'
                  : auction.status === 'ENDED' || auction.status === 'SOLD'
                    ? 'outline'
                    : 'secondary'
              }
            />
          </span>
          <span className="absolute top-2 left-2">
            <AuctionTypeBadge
              auctionType={auction.auctionType}
              variant="secondary"
            />
          </span>
        </div>
        <CardHeader className="pb-2">
          <h3 className="text-lg line-clamp-2 font-semibold">
            {auction.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {auction.category} • {auction.condition}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xl font-bold text-foreground">
            ₹ {auction.startPrice.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Ends {new Date(auction.endAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
