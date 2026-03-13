'use server';

import { kycService } from '@/services/kyc/kyc.service';
import { ApiResponse } from '@/types/api.index';
import { DocumentSide, IKycStatusOutput, KycFor } from '@/types/kyc.type';

export const getKycStatusAction = async (
  kycFor: string
): Promise<ApiResponse<IKycStatusOutput>> => {
  return await kycService.getKycStatus(kycFor);
};

export const generateKycUploadUrlAction = async ({
  kycFor,
  contentType,
  fileName,
  fileSize,
}: {
  kycFor: KycFor;
  contentType: string;
  fileName: string;
  fileSize: number;
}): Promise<ApiResponse<{ uploadUrl: string; fileKey: string }>> => {
  return await kycService.generateKycUploadUrl({
    kycFor,
    contentType,
    fileName,
    fileSize,
  });
};

export const uploadKycToS3Action = async ({
  uploadUrl,
  file,
}: {
  uploadUrl: string;
  file: File;
}): Promise<ApiResponse<void>> => {
  return await kycService.uploadKycToS3({ uploadUrl, file });
};

export const updateKycAction = async ({
  kycFor,
  documentType,
  fileKey,
  side,
}: {
  kycFor: KycFor;
  documentType: string;
  fileKey: string;
  side: DocumentSide;
}): Promise<ApiResponse<IKycStatusOutput>> => {
  return await kycService.updateKyc({ kycFor, documentType, fileKey, side });
};

export const submitKycAction = async ({
  kycFor,
}: {
  kycFor: KycFor;
}): Promise<ApiResponse<IKycStatusOutput>> => {
  return await kycService.submitKyc({ kycFor });
};
