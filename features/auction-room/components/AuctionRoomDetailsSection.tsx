'use client';

import {
  CalendarClock,
  IndianRupee,
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

import { arCardCanvas, arType } from '../lib/auction-room-design';

import { AuctionRoomStatTile } from './AuctionRoomStatTile';

type AuctionRoomDetailsSectionProps = {
  auction: IAuctionDto | null;
};

/**
 * Left column content: description first, then schedule & auction rules (home-style compact cards).
 */
export function AuctionRoomDetailsSection({
  auction,
}: AuctionRoomDetailsSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Description — before rules, like a marketplace listing */}
      <section className={arCardCanvas('overflow-hidden')}>
        <div className="border-b border-border/80 px-2.5 py-2">
          <h2 className={arType.sectionLabel}>Description</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            About this item
          </p>
        </div>
        <div className="px-2.5 py-2">
          <div className="max-h-36 overflow-y-auto text-xs leading-relaxed text-foreground/90 [scrollbar-width:thin]">
            {auction?.description?.trim()
              ? auction.description
              : 'No description provided.'}
          </div>
        </div>
      </section>

      {/* Schedule & rules */}
      <section className={arCardCanvas('overflow-hidden')}>
        <div className="border-b border-border/80 px-2.5 py-2">
          <h2 className={arType.sectionLabel}>Auction rules</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Timing & bid mechanics
          </p>
        </div>
        <div className="space-y-2 px-2.5 py-2">
          <div className="grid grid-cols-2 gap-1.5">
            <AuctionRoomStatTile label="Starts" icon={<CalendarClock />}>
              <span className={arType.monoStat}>
                {auction?.startAt
                  ? formatAuctionDateTime(auction.startAt)
                  : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Ends" icon={<Timer />}>
              <span className={arType.monoStat}>
                {auction?.endAt ? formatAuctionDateTime(auction.endAt) : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Opening bid" icon={<IndianRupee />}>
              <span className="tabular-nums text-xs font-semibold text-foreground">
                {auction ? formatAuctionPrice(auction.startPrice) : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Condition" icon={<Package />}>
              <span className="text-xs">{auction?.condition ?? '—'}</span>
            </AuctionRoomStatTile>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <AuctionRoomStatTile label="Min increment" icon={<Zap />}>
              <span className="tabular-nums text-xs font-medium">
                {auction ? formatAuctionPrice(auction.minIncrement) : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Bid cooldown" icon={<Timer />}>
              <span className="tabular-nums text-xs">
                {auction != null ? `${auction.bidCooldownSeconds}s` : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Anti-snipe" icon={<Shield />}>
              <span className="tabular-nums text-xs">
                {auction != null ? `${auction.antiSnipSeconds}s` : '—'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Max extensions" icon={<Layers />}>
              <span className="tabular-nums text-xs">
                {auction?.maxExtensionCount ?? '—'}
              </span>
            </AuctionRoomStatTile>
          </div>
        </div>
      </section>
    </div>
  );
}
