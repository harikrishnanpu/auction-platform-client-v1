'use client';

import { CalendarClock, DollarSign, Package, Timer } from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import { formatAuctionDateTime, formatAuctionPrice } from '@/lib/auction-utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AuctionRoomStatTile } from './AuctionRoomStatTile';

type AuctionRoomDetailsSectionProps = {
  auction: IAuctionDto | null;
};

export function AuctionRoomDetailsSection({
  auction,
}: AuctionRoomDetailsSectionProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-3">
        <CardTitle className="text-sm font-semibold">Listing details</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Schedule, pricing, and item condition for this auction.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 pt-4 sm:grid-cols-2">
        <AuctionRoomStatTile label="Starts" icon={<CalendarClock />}>
          <span className="font-mono text-xs sm:text-sm">
            {auction?.startAt ? formatAuctionDateTime(auction.startAt) : '—'}
          </span>
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Ends" icon={<Timer />}>
          <span className="font-mono text-xs sm:text-sm">
            {auction?.endAt ? formatAuctionDateTime(auction.endAt) : '—'}
          </span>
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Opening price" icon={<DollarSign />}>
          <span className="tabular-nums">
            {auction ? formatAuctionPrice(auction.startPrice) : '—'}
          </span>
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Condition" icon={<Package />}>
          {auction?.condition ?? '—'}
        </AuctionRoomStatTile>
      </CardContent>
      <CardContent className="border-t border-border/50 bg-muted/10 pt-4 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </p>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-border/50 bg-background/50 p-3 text-xs leading-relaxed text-foreground">
          {auction?.description?.trim()
            ? auction.description
            : 'No description provided.'}
        </div>
      </CardContent>
    </Card>
  );
}
