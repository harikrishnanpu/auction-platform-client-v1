import type { AuctionType } from '@/types/auction.type';

export function getAuctionTypeLabel(type: AuctionType): string {
  const map: Record<AuctionType, string> = {
    LONG: 'Long',
    LIVE: 'Live',
    SEALED: 'Sealed',
  };
  return map[type] ?? type;
}

export const AUCTION_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Refurbished',
] as const;
