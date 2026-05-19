import type { IAuctionDto } from '@/types/auction.type';
import type {
  IAuctionRoomBid,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
} from '@/utils/auction-utils';

export function getBidderName(
  userId: string,
  participants: IAuctionRoomParticipant[]
): string {
  return participants.find((p) => p.userId === userId)?.userName ?? 'Bidder';
}

export function getParticipantHighBid(
  userId: string,
  liveFeed: IAuctionRoomBid[]
): number | null {
  const amounts = liveFeed
    .filter((b) => b.userId === userId)
    .map((b) => b.amount);
  return amounts.length ? Math.max(...amounts) : null;
}

export function formatAuctionEndHint(auction: IAuctionDto | null): string {
  if (!auction?.endAt) return '';
  const end = new Date(auction.endAt);
  const now = new Date();
  const isToday =
    end.getDate() === now.getDate() &&
    end.getMonth() === now.getMonth() &&
    end.getFullYear() === now.getFullYear();

  const time = end.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return isToday ? `Ends Today, ${time}` : `Ends ${formatAuctionDateTime(end)}`;
}

/** @deprecated Prefer `formatAuctionNumberDisplay` when auction DTO is available */
export function getLotLabel(auctionId: string): string {
  const suffix = auctionId.replace(/-/g, '').slice(-4).toUpperCase();
  return `Lot #${suffix || '—'}`;
}

/** Human-readable auction number from API (e.g. auc_2026519_abc → Auction 2026519-abc). */
export function formatAuctionNumberDisplay(
  auction: IAuctionDto | null | undefined
): string {
  const raw = auction?.auctionNumber?.trim();
  if (!raw) return '—';
  return raw
    .replace(/^auc_/i, 'Auction ')
    .replace(/_/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatBidAmount(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return formatAuctionPrice(amount);
}
