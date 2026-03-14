'use client';

import { useMemo } from 'react';
import { useAuctionByIdQuery } from '@/modules/auction/hooks';
import { mapDetailToRoomAuction } from '../utils/map-detail-to-room-auction';
import type { Auction } from '../types/auction.types';

export interface UseAuctionRoomDataOptions {
  auctionId: string | null | undefined;
  enabled?: boolean;
}

export function useAuctionRoomData(options: UseAuctionRoomDataOptions) {
  const { auctionId, enabled = true } = options;
  const query = useAuctionByIdQuery({
    auctionId,
    enabled: Boolean(auctionId) && enabled,
  });

  const roomAuction: Auction | null = useMemo(() => {
    if (!query.data) return null;
    return mapDetailToRoomAuction(query.data);
  }, [query.data]);

  return {
    auction: roomAuction,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
