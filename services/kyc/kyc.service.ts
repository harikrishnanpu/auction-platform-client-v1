import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import { DocumentSide, IKycStatusOutput, KycFor } from '@/types/kyc.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { cookies } from 'next/headers';

export const kycService = {
  getKycStatus: async (
    kycFor: string
  ): Promise<ApiResponse<IKycStatusOutput>> => {
    try {
      const cookieStorage = await cookies();

      const res = await fetch(buildApiUrl(API_ENDPOINTS.kyc.getKycStatus), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify({
          kycFor: kycFor,
        }),
        cache: 'no-store',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      return { success: true, data: data.data };
    } catch (error: unknown) {
      console.log(error);
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  generateKycUploadUrl: async ({
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
    try {
      const cookieStorage = await cookies();

      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.kyc.generateKycUploadUrl),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStorage.toString(),
          },
          credentials: 'include',
          body: JSON.stringify({
            kycFor: kycFor,
            contentType: contentType,
            fileName: fileName,
            fileSize: fileSize,
          }),
        }
      );

      const response = await res.json();

      console.log('RESOPONSE: CHECK:', response);

      if (!res.ok) {
        throw new Error(response.message);
      }

      return { success: true, data: response.data };
    } catch (error: unknown) {
      console.log(error);
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  uploadKycToS3: async ({
    uploadUrl,
    file,
  }: {
    uploadUrl: string;
    file: File;
  }): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return { success: true, data: null };
    } catch (error: unknown) {
      console.log('ERROR S3 UPLOAD', error);
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  updateKyc: async ({
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
    try {
      const cookieStorage = await cookies();

      const res = await fetch(buildApiUrl(API_ENDPOINTS.kyc.updateKyc), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify({
          kycFor: kycFor,
          documentType: documentType,
          fileKey: fileKey,
          side: side,
        }),
        cache: 'no-store',
      });

      const response = await res.json();

      if (!res.ok) {
        console.log('ERROR IN UPDATE KYC !OK');

        throw new Error(response.message);
      }

      console.log('RESOPONSE: CHECK:', response);

      return { success: true, data: response.data };
    } catch (error: unknown) {
      console.log(' ERROR IN UPDATE KYC');
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  submitKyc: async ({
    kycFor,
  }: {
    kycFor: KycFor;
  }): Promise<ApiResponse<IKycStatusOutput>> => {
    try {
      const cookieStorage = await cookies();

      const res = await fetch(buildApiUrl(API_ENDPOINTS.kyc.submitKyc), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStorage.toString(),
        },
        credentials: 'include',
        body: JSON.stringify({
          kycFor: kycFor,
        }),
        cache: 'no-store',
      });

      const response = await res.json();

      if (!res.ok) {
        console.log('ERROR IN SUBMIT KYC !OK');

        throw new Error(response.message);
      }

      console.log('RESOPONSE: CHECK:', response);

      return { success: true, data: response.data };
    } catch (error: unknown) {
      console.log(' ERROR IN SUBMIT KYC');
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },
};
