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
        'rounded-lg border border-border/35 bg-background/30 px-1.5 py-1 transition-colors hover:bg-background/50',
        className
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="text-muted-foreground/60 [&_svg]:size-2.5">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-px text-[11px] font-medium leading-tight text-foreground">
        {children}
      </div>
    </div>
  );
}
