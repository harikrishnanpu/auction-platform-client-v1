'use client';

import { useAuctionByIdQuery } from '@/modules/auction/hooks';

export function useAuctionDetailData(auctionId: string | null | undefined) {
  const query = useAuctionByIdQuery({ auctionId, enabled: Boolean(auctionId) });

  return {
    auction: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
