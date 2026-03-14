'use client';

import {
  useBrowseAuctionsQuery,
  type BrowseAuctionsFilters,
} from '@/modules/auction/hooks';

export function useAuctionListData(filters: BrowseAuctionsFilters) {
  const query = useBrowseAuctionsQuery({ filters, enabled: true });

  return {
    auctions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
