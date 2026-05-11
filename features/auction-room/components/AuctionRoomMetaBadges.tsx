'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { arType } from '../lib/auction-room-design';

type AuctionRoomMetaBadgesProps = {
  categoryName: string;
  typeLabel: string;
  statusLabel: string;
  connectionSlot: ReactNode;
  className?: string;
};

export function AuctionRoomMetaBadges({
  categoryName,
  typeLabel,
  statusLabel,
  connectionSlot,
  className,
}: AuctionRoomMetaBadgesProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-3', className)}>
      <div className="grid grid-cols-1 gap-3 rounded-[10px] border border-border/70 bg-card px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:bg-muted/20">
        <div className="min-w-0 space-y-1">
          <p className={arType.listingMetaLabel}>Category</p>
          <p className="wrap-break-word text-sm font-medium leading-snug text-foreground">
            {categoryName}
          </p>
        </div>
        <div className="border-t border-border/50 pt-3">
          <div className="min-w-0 space-y-1">
            <p className={arType.listingMetaLabel}>Auction format</p>
            <p className="text-sm font-medium leading-snug text-foreground">
              {typeLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <span
          className={cn(
            'inline-flex w-fit max-w-full shrink-0 items-center rounded-full border border-border/80 bg-muted/35 px-3 py-1.5 text-xs font-semibold text-foreground',
            statusLabel === 'Live' &&
              'border-emerald-500/40 bg-emerald-500/12 text-emerald-900 dark:text-emerald-200',
            statusLabel === 'Paused' &&
              'border-amber-500/40 bg-amber-500/12 text-amber-950 dark:text-amber-200',
            statusLabel === 'Sold' &&
              'border-emerald-600/40 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200',
            statusLabel === 'Ended' && 'border-border/80 text-muted-foreground',
            statusLabel === 'Cancelled' &&
              'border-destructive/35 bg-destructive/10 text-destructive',
            statusLabel === 'Public offer' &&
              'border-sky-500/40 bg-sky-500/12 text-sky-950 dark:text-sky-200'
          )}
        >
          {statusLabel}
        </span>
        <div className="min-w-0 flex-1 [&>span]:max-w-full [&>span]:text-xs [&>span]:py-1.5">
          {connectionSlot}
        </div>
      </div>
    </div>
  );
}
