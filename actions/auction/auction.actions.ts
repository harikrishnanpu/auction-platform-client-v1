'use server';

import { auctionService } from '@/services/auction/auction.service';
import { ApiResponse } from '@/types/api.index';
import {
  CreateAuctionInput,
  CreateAuctionOutput,
  SellerAuctionListItem,
  BrowseAuctionListItem,
  AuctionDetail,
  AuctionWithRoom,
  UpdateAuctionInput,
  UpdateAuctionOutput,
} from '@/types/auction.type';
import { cookies } from 'next/headers';

export async function createAuctionAction(
  input: CreateAuctionInput
): Promise<ApiResponse<CreateAuctionOutput>> {
  const cookieStorage = await cookies();
  return await auctionService.create(input, cookieStorage);
}

export async function getSellerAuctionsAction(): Promise<
  ApiResponse<{ auctions: SellerAuctionListItem[] }>
> {
  return auctionService.getSellerAuctions();
}

export async function getBrowseAuctionsAction(params?: {
  category?: string;
  auctionType?: string;
}): Promise<ApiResponse<{ auctions: BrowseAuctionListItem[] }>> {
  return auctionService.getBrowse(params);
}

export async function getAuctionByIdAction(
  id: string,
  mode: AuctionViewMode = 'user'
): Promise<ApiResponse<AuctionDetail>> {
  const fn =
    mode === 'seller'
      ? auctionService.getAuctionForSeller
      : auctionService.getAuctionForUser;
  const res = await fn(id);
  if (res.success && res.data) {
    return { success: true, data: res.data.auction };
  }
  return {
    success: res.success,
    data: null,
    error: res.error,
  };
}

export async function getAuctionWithRoomAction(
  id: string,
  mode: AuctionViewMode
): Promise<ApiResponse<AuctionWithRoom>> {
  const fn =
    mode === 'seller'
      ? auctionService.getAuctionForSeller
      : auctionService.getAuctionForUser;
  return fn(id);
}

export async function placeBidAction(
  auctionId: string,
  amount: number
): Promise<
  ApiResponse<{
    id: string;
    auctionId: string;
    userId: string;
    amount: number;
    createdAt: string;
  }>
> {
  return auctionService.placeBid(auctionId, amount);
}

export async function updateAuctionAction(
  id: string,
  input: UpdateAuctionInput
): Promise<ApiResponse<UpdateAuctionOutput>> {
  return auctionService.update(id, input);
}

export async function publishAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  return auctionService.publish(id);
}

export async function endAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  return auctionService.end(id);
}

export async function generateAuctionUploadUrlAction({
  contentType,
  fileName,
  fileSize,
}: {
  contentType: string;
  fileName: string;
  fileSize: number;
}): Promise<ApiResponse<{ uploadUrl: string; fileKey: string }>> {
  return auctionService.generateUploadUrl({
    contentType,
    fileName,
    fileSize,
  });
}
