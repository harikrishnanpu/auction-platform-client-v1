import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import {
  CreateAuctionInput,
  IGetAllSellerAuctionsFilter,
  IGetAllSellerAuctionsResponse,
  IGetBrowseAuctionsFilter,
  IGetBrowseAuctionsResponse,
  IAuctionDto,
  UpdateAuctionDraftInput,
} from '@/types/auction.type';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { buildQuery } from '@/apiInstance';

export const auctionService = {
  create: async (
    input: CreateAuctionInput,
    cookieStore: ReadonlyRequestCookies
  ): Promise<ApiResponse<IAuctionDto>> => {
    return apiFetch<IAuctionDto>(
      buildApiUrl(API_ENDPOINTS.auction.create),
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
      cookieStore
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
    const cookieStorage = await cookies();

    return await apiFetch<{ uploadUrl: string; fileKey: string }>(
      buildApiUrl(API_ENDPOINTS.auction.generateUploadUrl),
      {
        method: 'POST',
        body: JSON.stringify({
          contentType,
          fileName,
          fileSize,
        }),
      },
      cookieStorage
    );
  },

  getSellerAuctions: async (
    cookieStore: ReadonlyRequestCookies,
    filter: IGetAllSellerAuctionsFilter
  ): Promise<ApiResponse<IGetAllSellerAuctionsResponse>> => {
    const query = buildQuery({
      status: filter.status,
      auctionType: filter.auctionType,
      categoryId: filter.categoryId,
      page: filter.page,
      limit: filter.limit,
      sort: filter.sort,
      order: filter.order,
      search: filter.search,
    });

    const url = `${buildApiUrl(API_ENDPOINTS.seller.getSellerAuctions)}?${query}`;

    return apiFetch<IGetAllSellerAuctionsResponse>(
      url,
      {
        method: 'GET',
      },
      cookieStore
    );
  },

  getLatestAuctions: async (
    cookieStore: ReadonlyRequestCookies,
    limit: number
  ): Promise<ApiResponse<IGetBrowseAuctionsResponse>> => {
    const query = buildQuery({ limit });
    const url = `${buildApiUrl(API_ENDPOINTS.auction.getLatestAuctions)}?${query}`;

    return apiFetch<IGetBrowseAuctionsResponse>(
      url,
      {
        method: 'GET',
      },
      cookieStore
    );
  },

  getBrowseAuctions: async (
    cookieStore: ReadonlyRequestCookies,
    filter: IGetBrowseAuctionsFilter
  ): Promise<ApiResponse<IGetBrowseAuctionsResponse>> => {
    const query = buildQuery({
      auctionType: filter.auctionType,
      categoryId: filter.categoryId,
      page: filter.page,
      limit: filter.limit,
      sort: filter.sort,
      order: filter.order,
      search: filter.search,
    });

    const url = `${buildApiUrl(API_ENDPOINTS.auction.getBrowseAuctions)}?${query}`;

    return apiFetch<IGetBrowseAuctionsResponse>(
      url,
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

  getAdminAuctions: async (
    cookieStore: ReadonlyRequestCookies,
    filter: IGetBrowseAuctionsFilter
  ): Promise<ApiResponse<IGetBrowseAuctionsResponse>> => {
    const query = buildQuery({
      auctionType: filter.auctionType,
      categoryId: filter.categoryId,
      page: filter.page,
      limit: filter.limit,
      sort: filter.sort,
      order: filter.order,
      search: filter.search,
    });

    const url = `${buildApiUrl(API_ENDPOINTS.admin.getAdminAuctions)}?${query}`;

    return apiFetch<IGetBrowseAuctionsResponse>(
      url,
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

  getSellerAuctionById: async (
    cookieStore: ReadonlyRequestCookies,
    id: string
  ): Promise<ApiResponse<IAuctionDto>> => {
    const url = buildApiUrl(API_ENDPOINTS.seller.getSellerAuctionById(id));
    return apiFetch<IAuctionDto>(
      url,
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

  updateSellerAuctionDraft: async (
    cookieStore: ReadonlyRequestCookies,
    id: string,
    input: UpdateAuctionDraftInput
  ): Promise<ApiResponse<{ id: string }>> => {
    const { categoryId, assets, ...rest } = input;
    const body = {
      ...rest,
      category: categoryId,
      assets: assets?.map((a) => ({
        fileKey: a.fileKey,
        position: a.position,
        assetType: a.assetType,
      })),
    };

    return apiFetch<{ id: string }>(
      buildApiUrl(API_ENDPOINTS.auction.updateAuction(id)),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      cookieStore,
      'no-store'
    );
  },

  publishSellerAuction: async (
    cookieStore: ReadonlyRequestCookies,
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    return apiFetch<{ id: string; status: string }>(
      buildApiUrl(API_ENDPOINTS.auction.publishAuction(id)),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      cookieStore,
      'no-store'
    );
  },

  pauseAuction: async (
    cookieStore: ReadonlyRequestCookies,
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    return apiFetch<{ id: string; status: string }>(
      buildApiUrl(API_ENDPOINTS.auction.pauseAuction(id)),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      cookieStore,
      'no-store'
    );
  },

  resumeAuction: async (
    cookieStore: ReadonlyRequestCookies,
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    return apiFetch<{ id: string; status: string }>(
      buildApiUrl(API_ENDPOINTS.auction.resumeAuction(id)),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      cookieStore,
      'no-store'
    );
  },

  endAuction: async (
    cookieStore: ReadonlyRequestCookies,
    id: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    return apiFetch<{ id: string; status: string }>(
      buildApiUrl(API_ENDPOINTS.auction.endAuction(id)),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      cookieStore,
      'no-store'
    );
  },
};
