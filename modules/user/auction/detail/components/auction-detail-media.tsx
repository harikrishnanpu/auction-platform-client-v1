'use client';

import { Card } from '@/components/ui/card';
import { getAuctionImageUrl } from '@/lib/auction-utils';
import type { AuctionAssetDto } from '@/types/auction.type';

export interface AuctionDetailMediaProps {
  title: string;
  sortedAssets: AuctionAssetDto[];
}

export function AuctionDetailMedia({
  title,
  sortedAssets,
}: AuctionDetailMediaProps) {
  const primary = sortedAssets[0];
  const hasMultiple = sortedAssets.length > 1;

  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="aspect-video bg-muted relative">
        {primary ? (
          primary.assetType === 'VIDEO' ? (
            <video
              src={getAuctionImageUrl(primary.fileKey)}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={getAuctionImageUrl(primary.fileKey)}
              alt={title}
              className="w-full h-full object-contain"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No media
          </div>
        )}
      </div>
      {hasMultiple && (
        <div className="p-3 flex gap-2 overflow-x-auto border-t">
          {sortedAssets.slice(1, 5).map((asset) => (
            <div
              key={asset.id}
              className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted"
            >
              {asset.assetType === 'VIDEO' ? (
                <video
                  src={getAuctionImageUrl(asset.fileKey)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={getAuctionImageUrl(asset.fileKey)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
