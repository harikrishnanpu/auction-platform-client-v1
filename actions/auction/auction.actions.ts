'use server';

import { auctionService } from '@/services/auction/auction.service';
import { ApiResponse } from '@/types/api.index';
import {
  CreateAuctionInput,
  CreateAuctionOutput,
  SellerAuctionListItem,
  BrowseAuctionListItem,
  AuctionDetail,
  UpdateAuctionInput,
  UpdateAuctionOutput,
} from '@/types/auction.type';

export async function createAuctionAction(
  input: CreateAuctionInput
): Promise<ApiResponse<CreateAuctionOutput>> {
  return auctionService.create(input);
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
  id: string
): Promise<ApiResponse<AuctionDetail>> {
  return auctionService.getAuctionById(id);
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
