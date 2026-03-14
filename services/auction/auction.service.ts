import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import {
  CreateAuctionInput,
  CreateAuctionOutput,
  SellerAuctionListItem,
  BrowseAuctionListItem,
  AuctionWithRoom,
  UpdateAuctionInput,
  UpdateAuctionOutput,
} from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { cookies } from 'next/headers';

export const auctionService = {
  create: async (
    input: CreateAuctionInput
  ): Promise<ApiResponse<CreateAuctionOutput>> => {
    try {
      const cookieStorage = await cookies();

      const res = await fetch(buildApiUrl(API_ENDPOINTS.auction.create), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      console.log(res);

      if (!res.ok) {
        const err = await res.json();
        console.log(err);
        throw new Error(err.message ?? 'Failed to create auction');
      }

      const data = await res.json();
      console.log(data);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      console.log(error);
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  getSellerAuctions: async (): Promise<
    ApiResponse<{ auctions: SellerAuctionListItem[] }>
  > => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.getSellerAuctions),
        {
          method: 'GET',
          headers: { Cookie: cookieStorage.toString() },
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to fetch auctions');
      }

      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  getBrowse: async (params?: {
    category?: string;
    auctionType?: string;
  }): Promise<ApiResponse<{ auctions: BrowseAuctionListItem[] }>> => {
    try {
      const cookieStorage = await cookies();
      const search = new URLSearchParams();

      if (params?.category) search.set('category', params.category);
      if (params?.auctionType) search.set('auctionType', params.auctionType);
      const q = search.toString();

      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.auction.getBrowse}?${q}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStorage.toString(),
          },
          credentials: 'include',
          cache: 'no-store',
        }
      );

      console.log(res);

      if (!res.ok) {
        const err = await res.json();
        console.log(err);
        throw new Error(err.message ?? 'Failed to fetch auctions');
      }
      const data = await res.json();
      console.log(data);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  getAuctionForSeller: async (
    id: string
  ): Promise<ApiResponse<AuctionWithRoom>> => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.getAuctionForSeller(id)),
        {
          method: 'GET',
          headers: { Cookie: cookieStorage.toString() },
          credentials: 'include',
          cache: 'no-store',
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(getErrorMessage(err) ?? 'Failed to fetch auction');
      }
      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  getAuctionForUser: async (
    id: string
  ): Promise<ApiResponse<AuctionWithRoom>> => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.getAuctionForUser(id)),
        {
          method: 'GET',
          headers: { Cookie: cookieStorage.toString() },
          credentials: 'include',
          cache: 'no-store',
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(getErrorMessage(err) ?? 'Failed to fetch auction');
      }
      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  placeBid: async (
    id: string,
    amount: number
  ): Promise<
    ApiResponse<{
      id: string;
      auctionId: string;
      userId: string;
      amount: number;
      createdAt: string;
    }>
  > => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(buildApiUrl(API_ENDPOINTS.auction.placeBid(id)), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to place bid');
      }
      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  update: async (
    id: string,
    input: UpdateAuctionInput
  ): Promise<ApiResponse<UpdateAuctionOutput>> => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(buildApiUrl(API_ENDPOINTS.auction.update(id)), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();

        throw new Error(err.message ?? 'Failed to update auction');
      }

      const data = await res.json();

      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  publish: async (
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(buildApiUrl(API_ENDPOINTS.auction.publish(id)), {
        method: 'POST',
        headers: { Cookie: cookieStorage.toString() },
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to publish auction');
      }

      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  end: async (
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    try {
      const cookieStorage = await cookies();
      const res = await fetch(buildApiUrl(API_ENDPOINTS.auction.end(id)), {
        method: 'POST',
        headers: { Cookie: cookieStorage.toString() },
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to end auction');
      }

      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },

  generateUploadUrl: async ({
    contentType,
    fileName,
    fileSize,
  }: {
    contentType: string;
    fileName: string;
    fileSize: number;
  }): Promise<ApiResponse<{ uploadUrl: string; fileKey: string }>> => {
    try {
      const cookieStorage = await cookies();

      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.generateUploadUrl),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStorage.toString(),
          },
          credentials: 'include',
          body: JSON.stringify({
            contentType,
            fileName,
            fileSize,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to generate upload URL');
      }

      const data = await res.json();
      console.log(data);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      console.log(error);
      return {
        success: false,
        data: null,
        error: getErrorMessage(error),
      };
    }
  },
};
