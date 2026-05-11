'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AuctionRoomStatTileProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  title?: string;
};

export function AuctionRoomStatTile({
  label,
  children,
  icon,
  className,
  title,
}: AuctionRoomStatTileProps) {
  return (
    <div
      title={title}
      className={cn(
        'rounded-[8px] border border-border/80 bg-card p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="text-muted-foreground opacity-70 [&_svg]:size-3">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-1 leading-tight text-foreground">{children}</div>
    </div>
  );
}
