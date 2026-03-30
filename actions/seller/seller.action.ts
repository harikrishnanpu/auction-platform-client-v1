'use server';
import type { ISellerAuctionPaymentsPage } from '@/modules/seller/payments/types/seller-payments.types';
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

export const getSellerAuctionPaymentsAction = async (params: {
  page: number;
  limit: number;
  status?: string;
}): Promise<ApiResponse<ISellerAuctionPaymentsPage>> => {
  const cookieStore = await cookies();
  return sellerService.getSellerAuctionPayments(params, cookieStore);
};
