'use server';

import { cookies } from 'next/headers';

import { adminAuctionCategoryService } from '@/services/admin/auction-category.service';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory, AuctionCategoryRequest } from '@/types/auction.type';

export const getAdminAuctionCategoriesAction = async (): Promise<
  ApiResponse<{ categories: AuctionCategory[] }>
> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.getAllCategories(cookieStore.toString());
};

export const getAuctionCategoryRequestsAction = async (): Promise<
  ApiResponse<{ categories: AuctionCategoryRequest[] }>
> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.getCategoryRequests(
    cookieStore.toString()
  );
};

export const approveAuctionCategoryRequestAction = async (
  requestId: string
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.approveCategoryRequest(
    requestId,
    cookieStore.toString()
  );
};

export const rejectAuctionCategoryRequestAction = async (
  requestId: string,
  reason: string
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.rejectCategoryRequest(
    requestId,
    reason,
    cookieStore.toString()
  );
};

export const updateAuctionCategoryAction = async (
  categoryId: string,
  input: { name: string; parentId: string | null }
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.updateAuctionCategory(
    categoryId,
    input,
    cookieStore.toString()
  );
};

export const setAuctionCategoryStatusAction = async (
  categoryId: string,
  status: boolean
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminAuctionCategoryService.changeAuctionCategoryStatus(
    categoryId,
    status,
    cookieStore.toString()
  );
};
