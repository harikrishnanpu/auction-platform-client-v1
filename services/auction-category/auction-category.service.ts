import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const auctionCategoryService = {
  getAll: async (
    cookieString: string
  ): Promise<ApiResponse<{ categories: AuctionCategory[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.getAuctionCategories),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          cache: 'no-store',
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      const categories: AuctionCategory[] =
        response.data?.categories ?? response.data ?? [];
      return { success: true, data: { categories } };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
};
