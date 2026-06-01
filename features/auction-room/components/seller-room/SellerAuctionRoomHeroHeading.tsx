'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';

import { formatAuctionNumberDisplay } from './seller-room-helpers';

type SellerAuctionRoomHeroHeadingProps = {
  auctionId: string;
  auction: IAuctionDto | null;
  statusLabel: string;
  isLive: boolean;
};

export function SellerAuctionRoomHeroHeading({
  auctionId,
  auction,
  statusLabel,
  isLive,
}: SellerAuctionRoomHeroHeadingProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {isLive ? (
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Live
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {statusLabel}
            </span>
          )}
          <span className="text-[11px] font-medium text-muted-foreground">
            {formatAuctionNumberDisplay(auction)}
          </span>
        </div>
      </div>
      <h1 className="mt-1.5 text-base font-semibold leading-snug text-foreground sm:text-lg">
        {auction?.title ?? 'Loading auction…'}
      </h1>
    </div>
  );
}
