'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuctionByIdAction } from '@/actions/auction/auction.actions';
import type { AuctionDetail } from '@/types/auction.type';
import { auctionQueryKeys } from './query-keys';

export interface UseAuctionByIdQueryOptions {
  auctionId: string | null | undefined;
  enabled?: boolean;
}

export function useAuctionByIdQuery(options: UseAuctionByIdQueryOptions) {
  const { auctionId, enabled = true } = options;
  const id = auctionId ?? '';

  return useQuery({
    queryKey: auctionQueryKeys.detail(id),
    queryFn: async (): Promise<AuctionDetail> => {
      const result = await getAuctionByIdAction(id);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Auction not found');
      }
      return result.data;
    },
    enabled: Boolean(id) && enabled,
  });
}
