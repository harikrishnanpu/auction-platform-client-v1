'use client';

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      <Badge
        variant="secondary"
        className="h-5 rounded-full border-0 bg-foreground/[0.06] px-2 text-[9px] font-medium leading-none text-foreground/90"
      >
        {categoryName}
      </Badge>
      <Badge
        variant="outline"
        className="h-5 rounded-full border-border/55 px-2 text-[9px] font-normal leading-none"
      >
        {typeLabel}
      </Badge>
      <Badge
        variant="outline"
        className={cn(
          'h-5 rounded-full px-2 text-[9px] font-semibold leading-none',
          statusLabel === 'Live' &&
            'border-emerald-500/35 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300',
          statusLabel === 'Paused' &&
            'border-amber-500/35 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200',
          statusLabel === 'Sold' &&
            'border-emerald-600/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
          statusLabel === 'Ended' &&
            'border-border bg-muted/50 text-muted-foreground',
          statusLabel === 'Cancelled' &&
            'border-destructive/30 bg-destructive/10 text-destructive',
          statusLabel === 'Public offer' &&
            'border-sky-500/35 bg-sky-500/[0.08] text-sky-900 dark:text-sky-200'
        )}
      >
        {statusLabel}
      </Badge>
      {connectionSlot}
    </div>
  );
}
