import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  auctionStatusLabel,
  formatAuctionDateTime,
  formatAuctionPrice,
  getAuctionCategoryName,
  getAuctionAssetUrl,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';
import type { AuctionStatus, IAuctionDto } from '@/types/auction.type';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function statusAccent(status: AuctionStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'border-l-emerald-500';
    case 'DRAFT':
      return 'border-l-amber-500';
    case 'SOLD':
      return 'border-l-emerald-600';
    case 'ENDED':
      return 'border-l-slate-500';
    case 'CANCELLED':
      return 'border-l-destructive';
    default:
      return 'border-l-muted-foreground/40';
  }
}

function statusBadgeClass(status: AuctionStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300';
    case 'DRAFT':
      return 'border-amber-500/25 bg-amber-500/[0.08] text-amber-800 dark:text-amber-200';
    case 'SOLD':
      return 'border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200';
    case 'ENDED':
      return 'border-border bg-muted/50 text-muted-foreground';
    case 'CANCELLED':
      return 'border-destructive/25 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted/40 text-muted-foreground';
  }
}

export interface SellerAuctionCardProps {
  auction: IAuctionDto;
  href?: string;
  className?: string;
}

export function SellerAuctionCard({
  auction,
  href = `/seller/auctions/${auction.id}`,
  className,
}: SellerAuctionCardProps) {
  const categoryName = getAuctionCategoryName(auction);
  const typeLabel = getAuctionTypeLabel(auction.auctionType);
  const asset0 = auction.assets?.[0];
  const asset0Url = getAuctionAssetUrl(asset0?.fileKey);
  const shouldRenderImage = Boolean(asset0Url) && asset0?.assetType !== 'VIDEO';

  return (
    <Link href={href} className={cn('group block outline-none', className)}>
      <article
        className={cn(
          'relative overflow-hidden rounded-lg border border-border/70 bg-card text-left shadow-none transition-colors',
          'hover:border-border hover:bg-muted/20',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'border-l-[3px]',
          statusAccent(auction.status)
        )}
      >
        <div className="flex items-start gap-3 p-3 sm:p-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/20">
            {shouldRenderImage ? (
              <Image
                src={asset0Url}
                alt={`${auction.title} thumbnail`}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20">
                <span className="text-[10px] font-medium text-muted-foreground">
                  Asset
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex max-w-[140px] truncate rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {categoryName}
              </span>
              <Badge
                variant="outline"
                className="h-5 border-border/60 px-1.5 text-[10px] font-normal"
              >
                {typeLabel}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'h-5 px-1.5 text-[10px] font-medium',
                  statusBadgeClass(auction.status)
                )}
              >
                {auctionStatusLabel(auction.status)}
              </Badge>
            </div>

            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
              {auction.title}
            </h3>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[11px] sm:grid-cols-2">
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">Start</dt>
                <dd className="font-mono tabular-nums text-foreground">
                  {formatAuctionDateTime(auction.startAt)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground">End</dt>
                <dd className="font-mono tabular-nums text-foreground">
                  {formatAuctionDateTime(auction.endAt)}
                </dd>
              </div>
            </dl>

            <div className="flex items-baseline justify-between gap-2 border-t border-border/50 pt-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Start price
                </p>
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {formatAuctionPrice(auction.startPrice)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
                View
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function SellerAuctionCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 border-l-[3px] border-l-muted',
        className
      )}
    >
      <div className="flex items-start gap-3 p-3 sm:p-3.5">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-[90%] rounded-md" />
          <Skeleton className="h-3 w-full max-w-[70%] rounded-md" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
