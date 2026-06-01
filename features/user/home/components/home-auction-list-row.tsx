'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { appListRow } from '@/lib/app-design';
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
  const ended = timeLabel === 'Ended';

  return (
    <Link
      href={`/auction/${auction.id}`}
      className={cn(
        appListRow(),
        'group flex items-center gap-4 px-1 py-3.5 sm:px-2'
      )}
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-[var(--surface-shadow-sm)] ring-1 ring-[var(--surface-ring)]">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="56px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
            Lot
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {auction.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Current Bid ·{' '}
          <span className="font-semibold text-foreground">
            {formatAuctionPrice(auction.startPrice)}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
        <p className="text-[11px] text-muted-foreground">
          {timePrefix} ·{' '}
          <span
            className={cn(
              'font-bold tabular-nums',
              showLiveRed && 'text-red-500',
              variant === 'sealed' && !ended && 'text-primary',
              ended && 'text-muted-foreground'
            )}
          >
            {timeLabel}
          </span>
        </p>
        {variant === 'live' ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-600" />
            Live
          </span>
        ) : (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            {getAuctionTypeLabel(auction.auctionType)}
          </span>
        )}
      </div>
    </Link>
  );
}
