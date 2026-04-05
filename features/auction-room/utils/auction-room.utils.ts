import type { AuctionType, IAuctionDto } from '@/types/auction.type';
import { formatAuctionPrice, getAuctionAssetUrl } from '@/utils/auction-utils';

export function isSealedAuctionType(
  auctionType: AuctionType | undefined
): boolean {
  return auctionType === 'SEALED';
}

export function isLiveAuctionType(
  auctionType: AuctionType | undefined
): boolean {
  return auctionType === 'LIVE';
}

export function computeNextBidMin(
  auction: IAuctionDto | null,
  currentBidAmount: number | null
): number | null {
  if (!auction) return null;
  if (currentBidAmount != null) {
    return currentBidAmount + auction.minIncrement;
  }
  return auction.startPrice;
}

export function formatBidCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'bid' : 'bids'}`;
}

/** Sealed: show winning amount only after end and when backend exposes a real value. */
export function shouldRevealSealedWinningAmount(
  isAuctionEnded: boolean,
  amount: number | null | undefined
): boolean {
  return isAuctionEnded && amount != null && amount > 0;
}

export function getBidPanelHeadline(
  isLiveRoom: boolean,
  isSealedRoom: boolean
): { title: string; description: string } {
  if (isLiveRoom) {
    return {
      title: 'Live auction',
      description: 'Coming soon — real-time bidding will open here.',
    };
  }
  if (isSealedRoom) {
    return {
      title: 'Bids placed',
      description: 'Sealed bids stay hidden until the auction ends.',
    };
  }
  return {
    title: 'Current bid',
    description: 'Live updates as bids arrive.',
  };
}

export function getAuctionRoomPrimaryBidDisplay(
  isLiveRoom: boolean,
  isSealedRoom: boolean,
  isAuctionEnded: boolean,
  bidCount: number,
  currentBidAmount: number | null
): string {
  if (isLiveRoom) return 'Coming soon';
  if (isSealedRoom) {
    if (shouldRevealSealedWinningAmount(isAuctionEnded, currentBidAmount)) {
      return formatAuctionPrice(currentBidAmount as number);
    }
    return formatBidCountLabel(bidCount);
  }
  return currentBidAmount != null ? formatAuctionPrice(currentBidAmount) : '—';
}

export function getBidFeedEmptyMessage(isLiveRoom: boolean): string {
  if (isLiveRoom) return 'Live bidding coming soon.';
  return 'No bids yet. Be the first when the room opens.';
}

export function formatBidFeedAmountLabel(
  isSealedRoom: boolean,
  amount: number
): string {
  if (isSealedRoom) return 'Sealed';
  return formatAuctionPrice(amount);
}

export function isCountdownLowUrgency(endCountdown: string | null): boolean {
  return Boolean(
    endCountdown && endCountdown !== '0:00' && endCountdown.length <= 5
  );
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
  if (
    s === 'ENDED' ||
    s === 'SOLD' ||
    s === 'FALLBACK_ENDED' ||
    s === 'FALLBACK_PUBLIC_NOTIFICATION'
  ) {
    return true;
  }
  return endCountdown === '0:00';
}

/** Only ACTIVE auctions accept bids (paused/draft/etc. do not). */
export function isAuctionActiveForBidding(status: string | undefined): boolean {
  return (status ?? '').toUpperCase() === 'ACTIVE';
}

export function checkIsPlaceBidEligible(
  userId: string | undefined,
  participants: Array<{ userId: string }>
): boolean {
  if (!userId) return false;
  return participants.some((p) => p.userId === userId);
}

export function auctionParticipationDepositAmount(startPrice: number): number {
  return startPrice * 0.1;
}
