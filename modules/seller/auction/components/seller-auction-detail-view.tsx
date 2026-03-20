import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import type { IAuctionDto, AuctionStatus } from '@/types/auction.type';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
  getAuctionAssetUrl,
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/lib/auction-utils';
import { cn } from '@/lib/utils';

function statusLabel(status: AuctionStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Live';
    case 'DRAFT':
      return 'Draft';
    case 'COMPLETED':
      return 'Done';
    case 'CANCELLED':
      return 'Off';
    default:
      return status;
  }
}

export function SellerAuctionDetailView({ auction }: { auction: IAuctionDto }) {
  const categoryName = getAuctionCategoryName(auction);
  const typeLabel = getAuctionTypeLabel(auction.auctionType);
  const asset0 = auction.assets?.[0];
  const asset0Url = getAuctionAssetUrl(asset0?.fileKey);

  return (
    <div className="rounded-lg border border-border/70 bg-card/20 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {auction.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 border-border/60 bg-muted/30 text-[11px]"
              >
                {categoryName}
              </Badge>
              <Badge variant="outline" className="h-6 text-[11px]">
                {typeLabel}
              </Badge>
              <Badge variant="secondary" className="h-6 text-[11px]">
                {statusLabel(auction.status)}
              </Badge>
            </div>
          </div>
        </div>

        {asset0Url ? (
          <div className="relative overflow-hidden rounded-lg border border-border/70 bg-muted/10 aspect-[4/1]">
            {asset0?.assetType === 'VIDEO' ? (
              <video
                src={asset0Url}
                className="h-full w-full object-cover"
                controls
                preload="metadata"
              />
            ) : (
              <Image
                src={asset0Url}
                alt={`${auction.title} media`}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-background/30 p-3">
            <p className="text-[11px] text-muted-foreground">Start time</p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {formatAuctionDateTime(auction.startAt)}
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/30 p-3">
            <p className="text-[11px] text-muted-foreground">End time</p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {formatAuctionDateTime(auction.endAt)}
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/30 p-3">
            <p className="text-[11px] text-muted-foreground">Start price</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatAuctionPrice(auction.startPrice)}
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/30 p-3">
            <p className="text-[11px] text-muted-foreground">Condition</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {auction.condition}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'rounded-lg border border-border/70 bg-background/30 p-3'
          )}
        >
          <p className="text-[11px] text-muted-foreground">Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {auction.description || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
