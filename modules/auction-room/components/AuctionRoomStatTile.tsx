'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AuctionRoomStatTileProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function AuctionRoomStatTile({
  label,
  children,
  icon,
  className,
}: AuctionRoomStatTileProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/60 bg-card/50 p-3 shadow-sm transition-colors hover:bg-card/80',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="text-muted-foreground/70 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-xs font-medium leading-snug text-foreground">
        {children}
      </div>
    </div>
  );
}
