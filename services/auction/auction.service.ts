import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import {
  CreateAuctionInput,
  CreateAuctionOutput,
  IAuctionDto,
} from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const auctionService = {
  create: async (
    input: CreateAuctionInput,
    cookieStore: ReadonlyRequestCookies
  ): Promise<ApiResponse<CreateAuctionOutput>> => {
    return apiFetch<CreateAuctionOutput>(
      buildApiUrl(API_ENDPOINTS.auction.create),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(input),
      },
      cookieStore,
      'no-store'
    );
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
      const cookieStore = await cookies();

      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.generateUploadUrl),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStore.toString(),
          },
          credentials: 'include',
          body: JSON.stringify({
            contentType,
            fileName,
            fileSize,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? data.message);
      if (!data.success) throw new Error(data.error ?? data.message);
      return { success: true, data: data.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getSellerAuctions: async (
    cookieStore: ReadonlyRequestCookies
  ): Promise<ApiResponse<{ auctions: IAuctionDto[] }>> => {
    return apiFetch<{ auctions: IAuctionDto[] }>(
      buildApiUrl(API_ENDPOINTS.seller.getSellerAuctions),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      cookieStore,
      'no-store'
    );
  },
};
