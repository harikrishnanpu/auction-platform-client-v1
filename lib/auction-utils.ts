import type { AuctionStatus, AuctionType } from '@/types/auction.type';

const S3_BASE =
  process.env.NEXT_PUBLIC_S3_BASE ??
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

export function getAuctionImageUrl(key?: string | null): string {
  if (!key) return 'https://placehold.co/200x200?text=Auction';
  if (key.startsWith('http')) return key;
  return `${S3_BASE}/${key}`;
}

export function getAuctionStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    ENDED: 'Ended',
    SOLD: 'Sold',
    CANCELLED: 'Cancelled',
    UPCOMING: 'Upcoming',
  };
  return map[status] ?? status;
}

export function getAuctionTypeLabel(type: AuctionType): string {
  const map: Record<AuctionType, string> = {
    LONG: 'Long',
    LIVE: 'Live',
    SEALED: 'Sealed',
  };
  return map[type] ?? type;
}

export function getBrowseStatusLabel(status: AuctionStatus): string {
  if (status === 'ACTIVE') return 'Live';
  if (status === 'ENDED' || status === 'SOLD') return 'Ended';
  return getAuctionStatusLabel(status);
}

export const AUCTION_CATEGORIES = [
  'Watches',
  'Textiles',
  'Collectibles',
  'Accessories',
  'Jewelry',
  'Art',
  'Antiques',
  'Other',
] as const;

export const AUCTION_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Refurbished',
] as const;
