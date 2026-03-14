'use client';

import { useQuery } from '@tanstack/react-query';
import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import type { BrowseAuctionListItem } from '@/types/auction.type';
import { auctionKeys } from './query-keys';

export function useBrowseAuctionsQuery(
  category?: string,
  auctionType?: string,
  enabled = true
) {
  return useQuery({
    queryKey: auctionKeys.browse(category, auctionType),
    queryFn: async (): Promise<BrowseAuctionListItem[]> => {
      const result = await getBrowseAuctionsAction({
        category: category && category !== 'All' ? category : undefined,
        auctionType: auctionType || undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load auctions');
      }
      return result.data.auctions;
    },
    enabled,
  });
}
