import type { IAuctionDto } from '@/types/auction.type';
import { getAuctionAssetUrl } from '@/lib/auction-utils';

export function auctionStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
    case 'PUBLISHED':
      return 'Live';
    case 'PAUSED':
      return 'Paused';
    case 'DRAFT':
      return 'Draft';
    case 'ENDED':
    case 'SOLD':
    case 'COMPLETED':
      return 'Ended';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

export function auctionMediaUrl(auction: IAuctionDto | null): string {
  const a0 = auction?.assets?.[0];
  return a0?.fileKey ? getAuctionAssetUrl(a0.fileKey) : '';
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function isAuctionEndedByStatus(
  status: string | undefined,
  endCountdown: string | null
): boolean {
  if (!status) return endCountdown === '0:00';
  const s = status.toUpperCase();
  if (s === 'ENDED' || s === 'SOLD' || s === 'COMPLETED') return true;
  return endCountdown === '0:00';
}

/** Only ACTIVE auctions accept bids (paused/draft/etc. do not). */
export function isAuctionActiveForBidding(status: string | undefined): boolean {
  return (status ?? '').toUpperCase() === 'ACTIVE';
}
