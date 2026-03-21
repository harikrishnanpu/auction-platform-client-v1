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
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <Badge
        variant="secondary"
        className="rounded-md border-0 bg-primary/10 px-1.5 py-0 text-[10px] font-medium text-primary"
      >
        {categoryName}
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-1.5 py-0 text-[10px] font-medium"
      >
        {typeLabel}
      </Badge>
      <Badge
        variant="outline"
        className={cn(
          'rounded-md px-1.5 py-0 text-[10px] font-semibold',
          statusLabel === 'Live' &&
            'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
          statusLabel === 'Paused' &&
            'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200',
          (statusLabel === 'Ended' || statusLabel === 'Cancelled') &&
            'border-border bg-muted/60 text-muted-foreground'
        )}
      >
        {statusLabel}
      </Badge>
      {connectionSlot}
    </div>
  );
}
