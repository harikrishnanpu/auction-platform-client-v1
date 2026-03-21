'use client';

import { ImageIcon } from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import { cn } from '@/lib/utils';

import { auctionMediaUrl } from '../utils/auction-room.utils';

type AuctionRoomHeroProps = {
  auction: IAuctionDto | null;
  className?: string;
};

export function AuctionRoomHero({ auction, className }: AuctionRoomHeroProps) {
  const url = auctionMediaUrl(auction);
  const isVideo = auction?.assets?.[0]?.assetType === 'VIDEO';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-sm ring-1 ring-black/5 dark:ring-white/10',
        className
      )}
    >
      {url ? (
        <div className="aspect-14/9 w-full sm:aspect-18/9">
          {isVideo ? (
            <video
              src={url}
              className="h-full w-full object-cover"
              controls
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={
                auction?.title
                  ? `${auction.title} — listing media`
                  : 'Auction media'
              }
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="flex aspect-14/9 w-full flex-col items-center justify-center gap-2 bg-muted/40 sm:aspect-18/9">
          <ImageIcon
            className="size-8 text-muted-foreground/50"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-xs text-muted-foreground">No media</p>
        </div>
      )}

      {url ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent sm:h-20" />
      ) : null}
    </div>
  );
}
