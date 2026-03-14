'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuctionWithRoomAction } from '@/actions/auction/auction.actions';
import { auctionKeys } from '@/modules/auction/hooks/query-keys';
import { mapDetailToRoomAuction } from '../utils/map-detail-to-room-auction';
import type { Auction } from '../../../../types/auction.types';
import type { AuctionViewMode } from '@/actions/auction/auction.actions';

export function useAuctionRoomData(
  auctionId: string | null | undefined,
  mode: AuctionViewMode,
  enabled = true
) {
  const id = auctionId ?? '';

  const query = useQuery({
    queryKey: auctionKeys.room(id, mode),
    queryFn: async () => {
      const result = await getAuctionWithRoomAction(id, mode);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load auction');
      }
      return result.data;
    },
    enabled: Boolean(id) && enabled,
  });

  const auction: Auction | null = query.data?.auction
    ? mapDetailToRoomAuction(query.data.auction)
    : null;
  const room = query.data?.room ?? null;

  return {
    auction,
    room,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
