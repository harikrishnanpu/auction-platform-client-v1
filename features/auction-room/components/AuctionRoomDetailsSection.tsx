'use client';

import {
  CalendarClock,
  DollarSign,
  Layers,
  Package,
  Shield,
  Timer,
  Zap,
} from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
} from '@/utils/auction-utils';

import { AuctionRoomStatTile } from './AuctionRoomStatTile';

type AuctionRoomDetailsSectionProps = {
  auction: IAuctionDto | null;
};

export function AuctionRoomDetailsSection({
  auction,
}: AuctionRoomDetailsSectionProps) {
  return (
    <section className="rounded-xl border border-border/50 bg-card/30">
      <div className="border-b border-border/40 px-2.5 py-1.5">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Listing details
        </h2>
      </div>
      <div className="space-y-2 p-2.5">
        <div className="grid gap-1.5 sm:grid-cols-2">
          <AuctionRoomStatTile label="Starts" icon={<CalendarClock />}>
            <span className="font-mono text-[11px] text-foreground">
              {auction?.startAt ? formatAuctionDateTime(auction.startAt) : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Ends" icon={<Timer />}>
            <span className="font-mono text-[11px] text-foreground">
              {auction?.endAt ? formatAuctionDateTime(auction.endAt) : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Opening bid" icon={<DollarSign />}>
            <span className="tabular-nums text-xs font-semibold">
              {auction ? formatAuctionPrice(auction.startPrice) : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Condition" icon={<Package />}>
            <span className="text-xs">{auction?.condition ?? '—'}</span>
          </AuctionRoomStatTile>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          <AuctionRoomStatTile label="Min increment" icon={<Zap />}>
            <span className="tabular-nums text-xs font-medium">
              {auction ? formatAuctionPrice(auction.minIncrement) : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Bid cooldown" icon={<Timer />}>
            <span className="text-xs tabular-nums">
              {auction != null ? `${auction.bidCooldownSeconds}s` : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Anti-snipe" icon={<Shield />}>
            <span className="text-xs tabular-nums">
              {auction != null ? `${auction.antiSnipSeconds}s` : '—'}
            </span>
          </AuctionRoomStatTile>
          <AuctionRoomStatTile label="Max extensions" icon={<Layers />}>
            <span className="text-xs tabular-nums">
              {auction?.maxExtensionCount ?? '—'}
            </span>
          </AuctionRoomStatTile>
        </div>

        <div className="rounded-lg border border-border/40 bg-background/50 px-2 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </p>
          <div className="mt-1 max-h-28 overflow-y-auto text-xs leading-snug text-foreground [scrollbar-width:thin]">
            {auction?.description?.trim()
              ? auction.description
              : 'No description provided.'}
          </div>
        </div>
      </div>
    </section>
  );
}
