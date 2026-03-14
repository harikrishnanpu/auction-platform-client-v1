'use client';

import { useQuery } from '@tanstack/react-query';
import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import type { BrowseAuctionListItem } from '@/types/auction.type';
import { auctionQueryKeys } from './query-keys';

export interface BrowseAuctionsFilters {
  category?: string;
  auctionType?: string;
}

export interface UseBrowseAuctionsQueryOptions {
  filters?: BrowseAuctionsFilters;
  enabled?: boolean;
}

export function useBrowseAuctionsQuery(
  options: UseBrowseAuctionsQueryOptions = {}
) {
  const { filters = {}, enabled = true } = options;
  const normalizedFilters = {
    category:
      filters.category && filters.category !== 'All'
        ? filters.category
        : undefined,
    auctionType: filters.auctionType || undefined,
  };

  return useQuery({
    queryKey: auctionQueryKeys.list(normalizedFilters),
    queryFn: async (): Promise<BrowseAuctionListItem[]> => {
      const result = await getBrowseAuctionsAction(normalizedFilters);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load auctions');
      }
      return result.data.auctions;
    },
    enabled,
  });
}
