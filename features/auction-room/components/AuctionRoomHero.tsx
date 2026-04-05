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
        'relative overflow-hidden rounded-lg border border-border/70 bg-muted/20 shadow-sm ring-1 ring-black/5 dark:ring-white/10',
        className
      )}
    >
      {url ? (
        <div className="aspect-[4/3] w-full max-h-52 sm:max-h-56">
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
        <div className="flex aspect-[4/3] w-full max-h-52 flex-col items-center justify-center gap-1.5 bg-muted/40 sm:max-h-56">
          <ImageIcon
            className="size-6 text-muted-foreground/50"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-xs text-muted-foreground">No media</p>
        </div>
      )}

      {url ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/30 to-transparent" />
      ) : null}
    </div>
  );
}
