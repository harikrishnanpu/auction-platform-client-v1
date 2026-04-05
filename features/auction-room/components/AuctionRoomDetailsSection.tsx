'use client';

import { CalendarClock, DollarSign, Package, Timer } from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
} from '@/utils/auction-utils';

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
    <Card className="overflow-hidden rounded-lg border-border/60 bg-card/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 px-3 py-2">
        <CardTitle className="text-xs font-semibold">Listing details</CardTitle>
        <CardDescription className="text-[10px] text-muted-foreground">
          Schedule, pricing, and condition.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1.5 px-3 pt-3 sm:grid-cols-2">
        <AuctionRoomStatTile label="Starts" icon={<CalendarClock />}>
          <span className="font-mono text-[11px] sm:text-xs">
            {auction?.startAt ? formatAuctionDateTime(auction.startAt) : '—'}
          </span>
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Ends" icon={<Timer />}>
          <span className="font-mono text-[11px] sm:text-xs">
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
      <CardContent className="border-t border-border/50 bg-muted/10 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </p>
        <div className="mt-1.5 max-h-48 overflow-y-auto rounded-lg border border-border/50 bg-background/50 p-2 text-[11px] leading-relaxed text-foreground">
          {auction?.description?.trim()
            ? auction.description
            : 'No description provided.'}
        </div>
      </CardContent>
    </Card>
  );
}
