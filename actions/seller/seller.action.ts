'use server';
import { sellerService } from '@/services/seller/seller.service';
import { ApiResponse } from '@/types/api.index';
import { AuctionCategory } from '@/types/auction.type';
import { cookies } from 'next/headers';

export const getAllSellerAuctionCategoryRequestAction = async (): Promise<
  ApiResponse<{ categories: AuctionCategory[] }>
> => {
  const cookieStore = await cookies();
  return sellerService.getAllSellerAuctionCategoryRequests(cookieStore);
};

export const requestAuctionCategoryAction = async (input: {
  name: string;
  parentId?: string | null;
}): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return sellerService.request(input, cookieStore.toString());
};
