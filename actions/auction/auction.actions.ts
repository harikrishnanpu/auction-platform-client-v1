'use server';

import { cookies } from 'next/headers';

import { auctionService } from '@/services/auction/auction.service';
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

export async function createAuctionAction(
  input: CreateAuctionInput
): Promise<ApiResponse<IGetAllSellerAuctionsResponse>> {
  const cookieStore = await cookies();
  return auctionService.create(input, cookieStore);
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

export async function getSellerAuctionsAction(
  filter: IGetAllSellerAuctionsFilter
): Promise<ApiResponse<IGetAllSellerAuctionsResponse>> {
  const cookieStore = await cookies();
  return auctionService.getSellerAuctions(cookieStore, filter);
}

export async function getSellerAuctionByIdAction(
  id: string
): Promise<ApiResponse<IAuctionDto>> {
  const cookieStore = await cookies();
  return auctionService.getSellerAuctionById(cookieStore, id);
}

export async function getLatestAuctionsAction(
  limit: number
): Promise<ApiResponse<IGetBrowseAuctionsResponse>> {
  const cookieStore = await cookies();
  return auctionService.getLatestAuctions(cookieStore, limit);
}

export async function getBrowseAuctionsAction(
  filter: IGetBrowseAuctionsFilter
): Promise<ApiResponse<IGetBrowseAuctionsResponse>> {
  const cookieStore = await cookies();
  return auctionService.getBrowseAuctions(cookieStore, filter);
}

export async function updateSellerAuctionDraftAction(
  id: string,
  input: UpdateAuctionDraftInput
): Promise<ApiResponse<{ id: string }>> {
  const cookieStore = await cookies();
  return auctionService.updateSellerAuctionDraft(cookieStore, id, input);
}

export async function publishSellerAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  const cookieStore = await cookies();
  return auctionService.publishSellerAuction(cookieStore, id);
}

export async function pauseAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  const cookieStore = await cookies();
  return auctionService.pauseAuction(cookieStore, id);
}

export async function resumeAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  const cookieStore = await cookies();
  return auctionService.resumeAuction(cookieStore, id);
}

export async function endAuctionAction(
  id: string
): Promise<ApiResponse<{ id: string; status: string }>> {
  const cookieStore = await cookies();
  return auctionService.endAuction(cookieStore, id);
}
