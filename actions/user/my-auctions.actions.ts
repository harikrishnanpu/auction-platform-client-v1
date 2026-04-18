'use server';

import { myAuctionsService } from '@/services/user/my-auctions.service';
import { ApiResponse } from '@/types/api.index';
import type {
  IGetMyAuctionsFilter,
  IGetMyAuctionsResponse,
} from '@/types/auction.type';

export const getMyAuctionsAction = async (
  filter: Partial<IGetMyAuctionsFilter> = {}
): Promise<ApiResponse<IGetMyAuctionsResponse>> => {
  return myAuctionsService.list(filter);
};
