'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { arCardCanvas, arType } from '../lib/auction-room-design';

type AuctionRoomListingHeaderProps = {
  title: ReactNode;
  badgesSlot: ReactNode;
  actionsSlot?: ReactNode;
  sectionLabel?: string;
  className?: string;
};

/** Listing identity at top of left column — vertical stack so title and meta breathe in narrow rails */
export function AuctionRoomListingHeader({
  title,
  badgesSlot,
  actionsSlot,
  sectionLabel = 'Auction room',
  className,
}: AuctionRoomListingHeaderProps) {
  return (
    <div
      className={cn(
        arCardCanvas(),
        'flex min-w-0 flex-col gap-0 overflow-hidden',
        className
      )}
    >
      <div className="min-w-0 border-b border-border/60 bg-muted/20 px-4 py-3.5 dark:bg-muted/10">
        <p className={cn(arType.sectionLabel, 'mb-2')}>{sectionLabel}</p>
        <h1 className={arType.listingTitle}>{title}</h1>
      </div>

      <div className="min-w-0 px-4 py-3">{badgesSlot}</div>

      {actionsSlot ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 border-t border-border/60 bg-muted/10 px-4 py-2.5 dark:bg-muted/5">
          {actionsSlot}
        </div>
      ) : null}
    </div>
  );
}
