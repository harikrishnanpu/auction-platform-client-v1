'use client';

import type { ReactNode } from 'react';

import { arCardCanvas, arType } from '../lib/auction-room-design';

type AuctionRoomSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuctionRoomSectionCard({
  title,
  description,
  children,
}: AuctionRoomSectionCardProps) {
  return (
    <section className={arCardCanvas('overflow-hidden')}>
      <div className="border-b border-border/80 px-2.5 py-2">
        <h3 className={arType.cardTitle}>{title}</h3>
        {description ? (
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-2 px-2.5 py-2">{children}</div>
    </section>
  );
}
