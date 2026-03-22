import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ZodChangePasswordFormValues } from '@/modules/user/profile/schemes/changeprofilePassword.schema';
import { ZodEditProfileFormValues } from '@/modules/user/profile/schemes/editProfile.schema';
import { ApiResponse } from '@/types/api.index';
import { IUser } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { cookies } from 'next/headers';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<IUser>> => {
    const cookieStorage = await cookies();
    return await apiFetch<IUser>(
      buildApiUrl(API_ENDPOINTS.user.profile),
      { method: 'GET' },
      cookieStorage
    );
  },

  editProfile: async (
    data: ZodEditProfileFormValues
  ): Promise<ApiResponse<{ user: IUser }>> => {
    const cookieStorage = await cookies();
    return await apiFetch<{ user: IUser }>(
      buildApiUrl(API_ENDPOINTS.user.editProfile),
      { method: 'PUT', body: JSON.stringify(data) },
      cookieStorage
    );
  },

  sendProfileChangePasswordOtp: async (): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.user.sendProfileChangePasswordOtp),
      { method: 'POST' },
      cookieStorage
    );
  },

  changeProfilePassword: async (
    data: ZodChangePasswordFormValues
  ): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.user.changeProfilePassword),
      { method: 'PUT', body: JSON.stringify(data) },
      cookieStorage
    );
  },

  editProfileSendOtp: async (): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.user.editProfileSendOtp),
      { method: 'POST' },
      cookieStorage
    );
  },

  getAvatarUploadUrl: async ({
    contentType,
    fileName,
    fileSize,
  }: {
    contentType: string;
    fileName: string;
    fileSize: number;
  }): Promise<ApiResponse<{ uploadUrl: string; fileKey: string }>> => {
    const cookieStorage = await cookies();
    return await apiFetch<{ uploadUrl: string; fileKey: string }>(
      buildApiUrl(API_ENDPOINTS.user.getAvatarUploadUrl),
      {
        method: 'POST',
        body: JSON.stringify({ contentType, fileName, fileSize }),
      },
      cookieStorage
    );
  },

  uploadAvatar: async (
    uploadUrl: string,
    file: File
  ): Promise<ApiResponse<null>> => {
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
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  updateAvatar: async (
    fileKey: string
  ): Promise<ApiResponse<{ user: IUser }>> => {
    const cookieStorage = await cookies();
    return await apiFetch<{ user: IUser }>(
      buildApiUrl(API_ENDPOINTS.user.updateAvatar),
      { method: 'PUT', body: JSON.stringify({ fileKey }) },
      cookieStorage
    );
  },
};
