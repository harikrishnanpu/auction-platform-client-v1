'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type {
  Bid,
  ChatMessage,
  Participant,
} from '../../../../types/auction.types';
import {
  getAuctionWithRoomAction,
  placeBidAction,
  type AuctionViewMode,
} from '@/actions/auction/auction.actions';
import { auctionKeys } from '@/modules/auction/hooks/query-keys';

export function useAuctionRoom(
  auctionId: string,
  mode: AuctionViewMode = 'user'
) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: auctionKeys.room(auctionId, mode),
    queryFn: async () => {
      const result = await getAuctionWithRoomAction(auctionId, mode);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load room');
      }
      return result.data;
    },
    enabled: Boolean(auctionId),
    refetchInterval: 5000,
  });

  const bids: Bid[] = data?.room?.bids ?? [];
  const participants: Participant[] = (data?.room?.participants ?? []).map(
    (p) => ({ ...p, isOnline: true })
  );
  const lastBidTime = data?.room?.lastBidTime ?? null;

  const placeBid = useCallback(
    async (amount: number): Promise<{ success: boolean; message?: string }> => {
      setError(null);
      setErrorCode(null);
      const result = await placeBidAction(auctionId, amount);
      if (result.success && result.data) {
        queryClient.invalidateQueries({
          queryKey: auctionKeys.room(auctionId, mode),
        });
        queryClient.invalidateQueries({
          queryKey: auctionKeys.detail(auctionId, mode),
        });
        return { success: true };
      }
      setError(result.error ?? 'Failed to place bid');
      setErrorCode('BID_ERROR');
      return { success: false, message: result.error ?? 'Failed to place bid' };
    },
    [auctionId, mode, queryClient]
  );

  return {
    bids,
    messages: [] as ChatMessage[],
    participants,
    connected: true,
    error,
    errorCode,
    endTimeOverride: null,
    lastBidTime,
    statusOverride: null,
    pausedOverride: null,
    isLoading,
    placeBid,
    sendMessage: async () => ({ success: false, message: 'Not available' }),
  };
}
