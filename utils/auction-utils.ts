import type { AuctionType, IAuctionDto } from '@/types/auction.type';

export function auctionStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'PUBLISHED':
      return 'Live';
    case 'PAUSED':
      return 'Paused';
    case 'DRAFT':
      return 'Draft';
    case 'ENDED':
      return 'Ended';
    case 'SOLD':
      return 'Sold';
    case 'FALLBACK_ENDED':
      return 'Fallback ended';
    case 'FALLBACK_PUBLIC_NOTIFICATION':
      return 'Public offer';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

export function getAuctionTypeLabel(type: AuctionType): string {
  const map: Record<AuctionType, string> = {
    LONG: 'Long',
    LIVE: 'Live',
    SEALED: 'Sealed',
  };
  return map[type] ?? type;
}

export function getAuctionCategoryName(auction: IAuctionDto): string {
  const c = auction.category;
  if (c && typeof c === 'object' && typeof c.name === 'string' && c.name.trim())
    return c.name.trim();
  return '—';
}

export function formatAuctionDateTime(value: unknown): string {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatAuctionPrice(
  amount: number,
  currency: string = 'INR'
): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const AUCTION_ASSET_BASE_URL =
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

export function getAuctionAssetUrl(fileKey?: string): string {
  if (!fileKey) return '';
  if (fileKey.startsWith('http')) return fileKey;
  return `${AUCTION_ASSET_BASE_URL}/${fileKey}`;
}

/**
 * Resolves a user avatar reference to a usable URL.
 * Accepts either an S3 object key or an absolute URL.
 */
export function getUserAvatarUrl(avatar?: string | null): string {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  return `${AUCTION_ASSET_BASE_URL}/${avatar}`;
}

export const AUCTION_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Refurbished',
] as const;
