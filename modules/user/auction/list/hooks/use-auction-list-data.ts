'use client';

import { useBrowseAuctionsQuery } from '@/modules/auction/hooks';

export function useAuctionListData(category?: string, auctionType?: string) {
  const query = useBrowseAuctionsQuery(category, auctionType, true);

  return {
    auctions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
