import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const sellerService = {
  getAllSellerAuctionCategoryRequests: async (
    cookieStore: ReadonlyRequestCookies
  ): Promise<ApiResponse<{ categories: AuctionCategory[] }>> => {
    try {
      return await apiFetch<{ categories: AuctionCategory[] }>(
        buildApiUrl(API_ENDPOINTS.seller.getAllSellerAuctionCategoryRequests),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        cookieStore,
        'no-store'
      );
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  request: async (
    input: { name: string; parentId?: string | null },
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.seller.requestAuctionCategory),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
};
