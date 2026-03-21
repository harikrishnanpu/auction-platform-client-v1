'use server';

import { cookies } from 'next/headers';

import { auctionService } from '@/services/auction/auction.service';
import { ApiResponse } from '@/types/api.index';
import type {
  IGetBrowseAuctionsFilter,
  IGetBrowseAuctionsResponse,
} from '@/types/auction.type';

export async function getAdminAuctionsAction(
  filter: IGetBrowseAuctionsFilter
): Promise<ApiResponse<IGetBrowseAuctionsResponse>> {
  const cookieStore = await cookies();
  return auctionService.getAdminAuctions(cookieStore, filter);
}
