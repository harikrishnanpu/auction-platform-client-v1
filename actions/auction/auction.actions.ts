'use server';

import { cookies } from 'next/headers';

import { auctionService } from '@/services/auction/auction.service';
import { ApiResponse } from '@/types/api.index';
import { CreateAuctionInput, CreateAuctionOutput } from '@/types/auction.type';

export async function createAuctionAction(
  input: CreateAuctionInput
): Promise<ApiResponse<CreateAuctionOutput>> {
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
