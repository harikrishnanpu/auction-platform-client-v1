import type {
  AuctionAssetType,
  AuctionType,
  IAuctionDto,
} from '@/types/auction.type';
import { formatAuctionPrice, getAuctionAssetUrl } from '@/utils/auction-utils';

export type AuctionRoomMediaItem = {
  url: string;
  assetType: AuctionAssetType;
  position: number;
};

/** Stable gallery order: by `position`, then file order. */
export function getAuctionMediaItems(
  auction: IAuctionDto | null
): AuctionRoomMediaItem[] {
  if (!auction?.assets?.length) return [];
  return [...auction.assets]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((raw, idx) => ({
      url: raw.fileKey ? getAuctionAssetUrl(raw.fileKey) : '',
      assetType: raw.assetType ?? 'IMAGE',
      position: raw.position ?? idx,
    }))
    .filter((item) => Boolean(item.url));
}

export type UserBidStanding =
  | 'winning'
  | 'outbid'
  | 'watching'
  | 'no_bids_yet'
  | 'sealed_invite'
  | 'sealed_placed'
  | 'live_soon'
  | 'need_join';

/**
 * Bidder-facing standing while the auction is active (USER mode only).
 * Sealed auctions never expose win/lose before close.
 */
export function computeUserBidStanding(params: {
  mode: 'SELLER' | 'USER' | 'ADMIN';
  userId: string | undefined;
  isParticipant: boolean;
  isAuctionActive: boolean;
  isAuctionEnded: boolean;
  isLiveRoom: boolean;
  isSealedRoom: boolean;
  currentBidUserId: string | null | undefined;
  liveFeed: { userId: string }[];
}): UserBidStanding | null {
  const {
    mode,
    userId,
    isParticipant,
    isAuctionActive,
    isAuctionEnded,
    isLiveRoom,
    isSealedRoom,
    currentBidUserId,
    liveFeed,
  } = params;

  if (mode !== 'USER' || isAuctionEnded || !isAuctionActive) return null;
  if (!userId) return null;
  if (!isParticipant) return 'need_join';

  if (isLiveRoom) return 'live_soon';

  const hasUserBid = liveFeed.some((b) => b.userId === userId);

  if (isSealedRoom) {
    return hasUserBid ? 'sealed_placed' : 'sealed_invite';
  }

  if (!currentBidUserId) {
    return hasUserBid ? 'winning' : 'no_bids_yet';
  }

  if (currentBidUserId === userId) return 'winning';
  if (hasUserBid) return 'outbid';
  return 'watching';
}

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
      description: 'Current bid and next bid update in real time.',
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
  if (isLiveRoom) {
    return currentBidAmount != null
      ? formatAuctionPrice(currentBidAmount)
      : '—';
  }
  if (isSealedRoom) {
    if (shouldRevealSealedWinningAmount(isAuctionEnded, currentBidAmount)) {
      return formatAuctionPrice(currentBidAmount as number);
    }
    return formatBidCountLabel(bidCount);
  }
  return currentBidAmount != null ? formatAuctionPrice(currentBidAmount) : '—';
}

export function getBidFeedEmptyMessage(isLiveRoom: boolean): string {
  if (isLiveRoom) return 'No live bids yet.';
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
  const items = getAuctionMediaItems(auction);
  return items[0]?.url ?? '';
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
