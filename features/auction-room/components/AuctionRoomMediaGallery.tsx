'use client';

import { useCallback, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  Play,
} from 'lucide-react';

import type { IAuctionDto } from '@/types/auction.type';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import {
  getAuctionMediaItems,
  type AuctionRoomMediaItem,
} from '../utils/auction-room.utils';

import { arCardCanvas } from '../lib/auction-room-design';

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
  const [viewerOpen, setViewerOpen] = useState(false);

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
          arCardCanvas(
            'flex aspect-video min-h-40 w-full max-h-[min(36vh,16rem)] flex-col items-center justify-center gap-1.5'
          ),
          className
        )}
      >
        <ImageIcon
          className="size-8 text-muted-foreground"
          strokeWidth={1.25}
          aria-hidden
        />
        <p className="text-xs font-medium text-muted-foreground">
          No media uploaded
        </p>
      </div>
    );
  }

  const title = auction?.title ?? 'Auction';

  return (
    <div className={cn('space-y-2', className)}>
      <div className={arCardCanvas('overflow-hidden p-0.5')}>
        <div className="relative overflow-hidden rounded-[8px] bg-muted/40">
          <div className="aspect-video w-full max-h-[min(36vh,16rem)] min-h-40">
            {current?.assetType === 'VIDEO' ? (
              <video
                key={current.url}
                src={current.url}
                className="h-full w-full object-contain"
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
                className="h-full w-full object-contain object-center"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="absolute right-2 top-2 inline-flex h-8 items-center gap-1 rounded-[8px] border border-border/80 bg-card/95 px-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted/50"
            aria-label="Open media in full screen"
          >
            <Expand className="size-3.5" />
            View
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition hover:bg-muted/50"
                aria-label="Previous asset"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition hover:bg-muted/50"
                aria-label="Next asset"
              >
                <ChevronRight className="size-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-border/80 bg-card/95 px-1.5 py-1 shadow-sm">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show asset ${i + 1}`}
                    aria-current={i === safeIndex}
                    className={cn(
                      'size-2 rounded-full transition',
                      i === safeIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {items.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {items.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Thumbnail ${i + 1}`}
              aria-current={i === safeIndex}
              className={cn(
                'relative h-11 w-16 shrink-0 overflow-hidden rounded-[6px] border-2 transition',
                i === safeIndex
                  ? 'border-primary shadow-sm'
                  : 'border-transparent opacity-75 hover:opacity-100'
              )}
            >
              {item.assetType === 'VIDEO' ? (
                <span className="flex h-full w-full items-center justify-center bg-muted/50">
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

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[92vh] w-[min(96vw,1100px)] max-w-[96vw] overflow-hidden border-border/70 bg-black/95 p-2 sm:p-3"
        >
          <DialogTitle className="sr-only">{title} media viewer</DialogTitle>
          <div className="relative overflow-hidden rounded-[10px] border border-white/15 bg-black">
            <div className="aspect-video max-h-[76vh] w-full min-h-72">
              {current?.assetType === 'VIDEO' ? (
                <video
                  key={`${current.url}-modal`}
                  src={current.url}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  autoPlay
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${current.url}-modal`}
                  src={current.url}
                  alt={`${title} — ${safeIndex + 1} of ${items.length}`}
                  className="h-full w-full object-contain object-center"
                />
              )}
            </div>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-sm transition hover:bg-black/80"
                  aria-label="Previous asset"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-sm transition hover:bg-black/80"
                  aria-label="Next asset"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-2 px-1 pt-1 text-xs text-zinc-300">
            <p className="truncate">
              {safeIndex + 1} / {items.length}
            </p>
            <p className="truncate text-right text-zinc-400">
              {current?.assetType === 'VIDEO' ? 'Video' : 'Image'}
            </p>
          </div>

          {items.length > 1 ? (
            <div className="mt-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {items.map((item, i) => (
                <button
                  key={`viewer-${item.url}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show asset ${i + 1}`}
                  aria-current={i === safeIndex}
                  className={cn(
                    'relative h-12 w-20 shrink-0 overflow-hidden rounded-[8px] border-2 transition',
                    i === safeIndex
                      ? 'border-primary'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  {item.assetType === 'VIDEO' ? (
                    <span className="flex h-full w-full items-center justify-center bg-zinc-800">
                      <Play className="size-4 text-zinc-300" />
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
