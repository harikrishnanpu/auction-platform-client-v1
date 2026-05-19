'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import {
  formatAuctionPrice,
  getAuctionAssetUrl,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';
import {
  formatTimeRemaining,
  isLiveTimeHighlight,
} from '@/utils/format-time-remaining';

interface HomeAuctionListRowProps {
  auction: IAuctionDto;
  variant: 'live' | 'sealed';
}

export function HomeAuctionListRow({
  auction,
  variant,
}: HomeAuctionListRowProps) {
  const timeStyle = variant === 'live' ? 'live' : 'sealed';

  const [timeLabel, setTimeLabel] = useState(() =>
    formatTimeRemaining(auction.endAt, timeStyle)
  );

  useEffect(() => {
    const tick = () =>
      setTimeLabel(formatTimeRemaining(auction.endAt, timeStyle));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [auction.endAt, timeStyle]);

  const thumb = getAuctionAssetUrl(auction.assets?.[0]?.fileKey);
  const timePrefix = variant === 'live' ? 'Time Left' : 'Ends In';
  const showLiveRed =
    variant === 'live' && isLiveTimeHighlight(auction.endAt, 'live');
  const showSealedAccent =
    variant === 'sealed' &&
    timeLabel !== 'Ended' &&
    !timeLabel.includes('Ended');

  return (
    <Link
      href={`/auction/${auction.id}`}
      className="group flex items-center gap-2.5 rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-muted/30"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Lot
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-foreground group-hover:text-brand-600">
          {auction.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Current Bid · {formatAuctionPrice(auction.startPrice)}
        </p>
        <p className="mt-1 text-xs">
          <span className="text-muted-foreground">{timePrefix} · </span>
          <span
            className={cn(
              'font-semibold tabular-nums',
              showLiveRed && 'text-red-500',
              showSealedAccent && 'text-brand-600 dark:text-brand-400',
              timeLabel === 'Ended' && 'text-muted-foreground'
            )}
          >
            {timeLabel}
          </span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {variant === 'live' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-600" />
            Live
          </span>
        ) : (
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            {getAuctionTypeLabel(auction.auctionType)}
          </span>
        )}
        <button
          type="button"
          className="hidden rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block"
          onClick={(e) => e.preventDefault()}
          aria-label="More options"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    </Link>
  );
}
