import { getAuctionImageUrl } from '@/lib/auction-utils';
import type { AuctionDetail } from '@/types/auction.type';
import type { Auction, AuctionMedia } from '../types/auction.types';

export function mapDetailToRoomAuction(detail: AuctionDetail): Auction {
  const sortedAssets = [...detail.assets].sort(
    (a, b) => a.position - b.position
  );
  const media: AuctionMedia[] = sortedAssets.map((asset, index) => ({
    id: asset.id,
    url: getAuctionImageUrl(asset.fileKey),
    isPrimary: index === 0,
    type: asset.assetType as 'IMAGE' | 'VIDEO',
  }));

  return {
    auctionId: detail.id,
    sellerId: detail.sellerId,
    title: detail.title,
    description: detail.description ?? '',
    category: detail.category,
    condition: detail.condition,
    startPrice: detail.startPrice,
    minIncrement: detail.minIncrement,
    startTime: detail.startAt,
    endTime: detail.endAt,
    status: detail.status,
    media,
    bidCooldownSeconds: detail.bidCooldownSeconds ?? 60,
    extensionCount: detail.extensionCount ?? 0,
    maxExtensions: detail.maxExtensionCount ?? 3,
    winnerId: detail.winnerId ?? null,
  };
}
