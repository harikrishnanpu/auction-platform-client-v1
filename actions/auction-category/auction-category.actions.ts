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
