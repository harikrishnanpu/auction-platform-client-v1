import { cookies } from 'next/headers';

import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import type {
  IGetMyAuctionsFilter,
  IGetMyAuctionsResponse,
} from '@/types/auction.type';

export const myAuctionsService = {
  list: async (
    filter: Partial<IGetMyAuctionsFilter> = {}
  ): Promise<ApiResponse<IGetMyAuctionsResponse>> => {
    const cookieStorage = await cookies();

    const query = buildQuery({
      page: filter.page ?? 1,
      limit: filter.limit ?? 4,
      search: filter.search ?? '',
      auctionType: filter.auctionType ?? 'ALL',
      status: filter.status ?? 'ALL',
      sort: filter.sort ?? 'startAt',
      order: filter.order ?? 'desc',
    });

    return apiFetch<IGetMyAuctionsResponse>(
      `${buildApiUrl(API_ENDPOINTS.user.myAuctions)}?${query}`,
      { method: 'GET' },
      cookieStorage
    );
  },
};
