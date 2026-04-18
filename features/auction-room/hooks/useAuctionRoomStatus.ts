'use client';

import type { IAuctionDto } from '@/types/auction.type';

import { useAuctionRoomCountdown } from './useAuctionRoomCountdown';
import {
  isAuctionActiveForBidding,
  isAuctionEndedByStatus,
} from '../utils/auction-room.utils';

export function useAuctionRoomStatus(
  auction: IAuctionDto | null,
  auctionStatusOverride: string | null
) {
  const endCountdown = useAuctionRoomCountdown(auction?.endAt);
  const auctionStatusStr =
    auctionStatusOverride ?? (auction?.status as unknown as string) ?? null;

  const isAuctionActive = isAuctionActiveForBidding(
    auctionStatusStr ?? undefined
  );
  const isAuctionEnded = isAuctionEndedByStatus(
    auctionStatusStr ?? undefined,
    endCountdown
  );

  return {
    auctionStatusStr,
    endCountdown,
    isAuctionActive,
    isAuctionEnded,
  };
}
