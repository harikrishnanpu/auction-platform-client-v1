import type { IAuctionDto } from '@/types/auction.type';
import type {
  IAuctionRoomBid,
  IAuctionRoomMetrics,
} from '@/types/auctionRoom.types';

import {
  getAuctionRoomPrimaryBidDisplay,
  isSealedAuctionType,
  isLiveAuctionType,
} from './auction-room.utils';

export type AuctionRoomMetricTile = {
  key: string;
  label: string;
  value: string;
  hint?: string;
};

function countBidsSince(feed: IAuctionRoomBid[], ms: number): number {
  const cutoff = Date.now() - ms;
  return feed.filter((b) => new Date(b.createdAt).getTime() >= cutoff).length;
}

function uniqueBidderIds(feed: IAuctionRoomBid[]): number {
  return new Set(feed.map((b) => b.userId)).size;
}

export type BuildAuctionRoomMetricTilesParams = {
  auction: IAuctionDto | null;
  liveFeed: IAuctionRoomBid[];
  participantsCount: number;
  metrics: IAuctionRoomMetrics | null | undefined;
  extensionsUsed: number;
  endCountdown: string | null;
  isAuctionEnded: boolean;
  isAuctionActive: boolean;
  currentBidAmount: number | null;
};

export function buildAuctionRoomMetricTiles(
  params: BuildAuctionRoomMetricTilesParams
): AuctionRoomMetricTile[] {
  const {
    auction,
    liveFeed,
    participantsCount,
    metrics,
    extensionsUsed,
    endCountdown,
    isAuctionEnded,
    isAuctionActive,
    currentBidAmount,
  } = params;

  const isSealed = isSealedAuctionType(auction?.auctionType);
  const isLive = isLiveAuctionType(auction?.auctionType);

  const totalBids =
    metrics?.totalBidCount != null && metrics.totalBidCount >= 0
      ? metrics.totalBidCount
      : liveFeed.length;

  const uniqueBidders =
    metrics?.uniqueBidderCount != null && metrics.uniqueBidderCount >= 0
      ? metrics.uniqueBidderCount
      : uniqueBidderIds(liveFeed);

  const bidsOneHour =
    metrics?.bidsInLastHour != null && metrics.bidsInLastHour >= 0
      ? metrics.bidsInLastHour
      : countBidsSince(liveFeed, 60 * 60 * 1000);

  const watchingStr =
    metrics?.watchingNow != null && metrics.watchingNow >= 0
      ? String(metrics.watchingNow)
      : null;

  const maxExt = auction?.maxExtensionCount ?? 0;
  const extUsed = Math.min(Math.max(0, extensionsUsed), Math.max(0, maxExt));

  const leadDisplay = getAuctionRoomPrimaryBidDisplay(
    isLive,
    isSealed,
    isAuctionEnded,
    totalBids,
    currentBidAmount
  );

  const tiles: AuctionRoomMetricTile[] = [
    {
      key: 'time',
      label: 'Time left',
      value: isAuctionEnded ? 'Ended' : (endCountdown ?? '—'),
      hint: isAuctionActive ? 'Live window' : undefined,
    },
    {
      key: 'lead',
      label: isSealed ? 'Bids placed' : 'Current lead',
      value: leadDisplay,
      hint:
        isSealed && isAuctionActive && !isAuctionEnded
          ? 'Amounts hidden until close'
          : undefined,
    },
    {
      key: 'totalBids',
      label: 'Total bids',
      value: String(totalBids),
    },
    {
      key: 'registered',
      label: 'Registered',
      value: String(participantsCount),
      hint: 'Eligible bidders',
    },
    {
      key: 'unique',
      label: 'Unique bidders',
      value: String(uniqueBidders),
    },
    {
      key: 'velocity',
      label: 'Bids (1h)',
      value: String(bidsOneHour),
    },
    {
      key: 'watching',
      label: 'Watching now',
      value: watchingStr ?? '—',
    },
  ];

  if (metrics?.listingViews != null && metrics.listingViews >= 0) {
    const v = metrics.listingViews;
    tiles.push({
      key: 'views',
      label: 'Listing views',
      value:
        v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(v),
    });
  }

  if (metrics?.savesCount != null && metrics.savesCount >= 0) {
    tiles.push({
      key: 'saves',
      label: 'Saves',
      value: String(metrics.savesCount),
    });
  }

  tiles.push({
    key: 'extensions',
    label: 'Extensions',
    value: `${extUsed} / ${maxExt}`,
    hint: 'Anti-snipe extensions used',
  });

  return tiles;
}
