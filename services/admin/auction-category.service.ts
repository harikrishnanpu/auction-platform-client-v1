import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory, AuctionCategoryRequest } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const adminAuctionCategoryService = {
  getAllCategories: async (
    cookieString: string
  ): Promise<ApiResponse<{ categories: AuctionCategory[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getAllAuctionCategories),
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

  getCategoryRequests: async (
    cookieString: string
  ): Promise<ApiResponse<{ categories: AuctionCategoryRequest[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getAuctionCategoryRequests),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          cache: 'no-store',
        }
      );

      const response = await res.json();
      console.log(response);
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      const categories: AuctionCategoryRequest[] =
        response.data?.categories ??
        response.data?.requests ??
        response.data ??
        [];
      return { success: true, data: { categories } };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  approveCategoryRequest: async (
    requestId: string,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(
          API_ENDPOINTS.admin.approveAuctionCategoryRequest(requestId)
        ),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieString,
          },
          credentials: 'include',
        }
      );

      // console.log(res);

      const response = await res.json();
      console.log(response);
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: null };
    } catch (err: unknown) {
      console.log(err);
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  rejectCategoryRequest: async (
    requestId: string,
    reason: string,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(
          API_ENDPOINTS.admin.rejectAuctionCategoryRequest(requestId)
        ),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify({ reason }),
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

  updateAuctionCategory: async (
    categoryId: string,
    input: { name: string; parentId: string | null },
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.updateAuctionCategory(categoryId)),
        {
          method: 'PUT',
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

  changeAuctionCategoryStatus: async (
    categoryId: string,
    status: boolean,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(
          API_ENDPOINTS.admin.ChangeAuctionCategoryStatus(categoryId)
        ),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify({ status }),
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
