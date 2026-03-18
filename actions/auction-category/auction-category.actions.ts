'use server';

import { cookies } from 'next/headers';

import { auctionCategoryService } from '@/services/auction-category/auction-category.service';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory } from '@/types/auction.type';

export const getAuctionCategoriesForSellerAction = async (): Promise<
  ApiResponse<{ categories: AuctionCategory[] }>
> => {
  const cookieStore = await cookies();
  return auctionCategoryService.getAll(cookieStore.toString());
};

export const requestAuctionCategoryAction = async (input: {
  name: string;
  parentId?: string | null;
}): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return auctionCategoryService.request(input, cookieStore.toString());
};
