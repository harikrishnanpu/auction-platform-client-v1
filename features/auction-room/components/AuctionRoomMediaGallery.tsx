'use client';

import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, Play } from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import { cn } from '@/lib/utils';

import {
  getAuctionMediaItems,
  type AuctionRoomMediaItem,
} from '../utils/auction-room.utils';

type AuctionRoomMediaGalleryProps = {
  auction: IAuctionDto | null;
  className?: string;
};

export function AuctionRoomMediaGallery({
  auction,
  className,
}: AuctionRoomMediaGalleryProps) {
  const items = auction ? getAuctionMediaItems(auction) : [];
  const [index, setIndex] = useState(0);

  const safeIndex = items.length ? Math.min(index, items.length - 1) : 0;
  const current: AuctionRoomMediaItem | undefined = items[safeIndex];

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!items.length) return;
      setIndex((i) => (i + dir + items.length) % items.length);
    },
    [items.length]
  );

  if (!items.length) {
    return (
      <div
        className={cn(
          'flex aspect-video w-full min-h-36 max-h-[min(42vh,20rem)] flex-col items-center justify-center gap-1 rounded-xl border border-border/50 bg-muted/20',
          className
        )}
      >
        <ImageIcon
          className="size-6 text-muted-foreground/40"
          strokeWidth={1.25}
          aria-hidden
        />
        <p className="text-xs text-muted-foreground">No media</p>
      </div>
    );
  }

  const title = auction?.title ?? 'Auction';

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/10">
        <div className="aspect-video w-full max-h-[min(42vh,20rem)] min-h-36">
          {current?.assetType === 'VIDEO' ? (
            <video
              key={current.url}
              src={current.url}
              className="h-full w-full object-contain bg-black/5"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.url}
              src={current.url}
              alt={`${title} — ${safeIndex + 1} of ${items.length}`}
              className="h-full w-full object-contain object-center bg-muted/20"
            />
          )}
        </div>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
              aria-label="Previous asset"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
              aria-label="Next asset"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-background/85 px-1.5 py-0.5 backdrop-blur-sm">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show asset ${i + 1}`}
                  aria-current={i === safeIndex}
                  className={cn(
                    'size-1.5 rounded-full transition',
                    i === safeIndex ? 'bg-foreground' : 'bg-foreground/25'
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:thin]">
          {items.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Thumbnail ${i + 1}`}
              aria-current={i === safeIndex}
              className={cn(
                'relative h-11 w-16 shrink-0 overflow-hidden rounded-md border transition',
                i === safeIndex
                  ? 'border-foreground/70 ring-1 ring-foreground/15'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              {item.assetType === 'VIDEO' ? (
                <span className="flex h-full w-full items-center justify-center bg-muted">
                  <Play className="size-4 text-muted-foreground" />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
