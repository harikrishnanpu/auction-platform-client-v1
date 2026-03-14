'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuctionByIdAction } from '@/actions/auction/auction.actions';
import type { AuctionDetail } from '@/types/auction.type';
import { auctionKeys } from './query-keys';

type Mode = 'seller' | 'user';

export function useAuctionByIdQuery(
  auctionId: string | null | undefined,
  mode: Mode = 'user',
  enabled = true
) {
  const id = auctionId ?? '';

  return useQuery({
    queryKey: auctionKeys.detail(id, mode),
    queryFn: async (): Promise<AuctionDetail> => {
      const result = await getAuctionByIdAction(id, mode);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Auction not found');
      }
      return result.data;
    },
    enabled: Boolean(id) && enabled,
  });
}
