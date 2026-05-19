'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import {
  auctionStatusLabel,
  formatAuctionPrice,
  getAuctionAssetUrl,
} from '@/utils/auction-utils';
import {
  formatTimeRemaining,
  isUrgentTimeRemaining,
} from '@/utils/format-time-remaining';

interface SellerAuctionTableRowProps {
  auction: IAuctionDto;
}

function statusBadge(auction: IAuctionDto): {
  label: string;
  className: string;
} {
  const s = String(auction.status).toUpperCase();
  if (s === 'ACTIVE' || s === 'PUBLISHED' || s === 'LIVE') {
    return {
      label: 'Live',
      className:
        'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400',
    };
  }
  if (s === 'ENDED' || s === 'SOLD') {
    return {
      label: s === 'SOLD' ? 'Ended' : 'Ended',
      className:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    };
  }
  if (s === 'CANCELLED') {
    return {
      label: 'Canceled',
      className: 'bg-muted text-muted-foreground',
    };
  }
  return {
    label: auctionStatusLabel(auction.status),
    className: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  };
}

export function SellerAuctionTableRow({ auction }: SellerAuctionTableRowProps) {
  const [timeLabel, setTimeLabel] = useState(() =>
    formatTimeRemaining(auction.endAt)
  );
  const badge = statusBadge(auction);
  const thumb = getAuctionAssetUrl(auction.assets?.[0]?.fileKey);
  const urgent = isUrgentTimeRemaining(auction.endAt);
  const isEnded = ['ENDED', 'SOLD'].includes(
    String(auction.status).toUpperCase()
  );

  useEffect(() => {
    const tick = () => setTimeLabel(formatTimeRemaining(auction.endAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [auction.endAt]);

  return (
    <Link
      href={`/seller/auction/${auction.id}`}
      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/40"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{auction.title}</p>
        <p className="text-xs text-muted-foreground">
          Current Bid · {formatAuctionPrice(auction.startPrice)}
        </p>
        {isEnded ? (
          <p className="text-xs font-medium text-emerald-600">
            Sold for {formatAuctionPrice(auction.startPrice)}
          </p>
        ) : (
          <p
            className={cn(
              'text-xs font-medium',
              urgent ? 'text-red-500' : 'text-muted-foreground'
            )}
          >
            {String(auction.status).toUpperCase() === 'DRAFT' ||
            new Date(auction.startAt) > new Date()
              ? 'Starts In'
              : 'Time Left'}{' '}
            · {timeLabel}
          </p>
        )}
      </div>
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
          badge.className
        )}
      >
        {badge.label === 'Live' ? (
          <span className="size-1.5 animate-pulse rounded-full bg-brand-600" />
        ) : null}
        {badge.label}
      </span>
      <button
        type="button"
        className="shrink-0 rounded-lg p-1 text-muted-foreground opacity-0 group-hover:opacity-100"
        onClick={(e) => e.preventDefault()}
        aria-label="More"
      >
        <MoreVertical className="size-4" />
      </button>
    </Link>
  );
}
