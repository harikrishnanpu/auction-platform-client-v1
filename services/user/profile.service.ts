import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ZodChangePasswordFormValues } from '@/features/user/profile/schemes/changeprofilePassword.schema';
import { ZodEditProfileFormValues } from '@/features/user/profile/schemes/editProfile.schema';
import { ApiResponse } from '@/types/api.index';
import type {
  IPublicSubscriptionPlan,
  IStartSubscriptionCheckoutResult,
} from '@/types/user-subscription.type';
import { IUser } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { cookies } from 'next/headers';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<IUser>> => {
    const cookieStorage = await cookies();
    return await apiFetch<IUser>(
      buildApiUrl(API_ENDPOINTS.auth.me),
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

  getSubscriptionPlans: async (): Promise<
    ApiResponse<IPublicSubscriptionPlan[]>
  > => {
    const cookieStorage = await cookies();
    return await apiFetch<IPublicSubscriptionPlan[]>(
      buildApiUrl(API_ENDPOINTS.user.subscriptionPlans),
      { method: 'GET' },
      cookieStorage
    );
  },

  startSubscriptionCheckout: async (
    subscriptionPlanId: string
  ): Promise<ApiResponse<IStartSubscriptionCheckoutResult>> => {
    const cookieStorage = await cookies();
    return await apiFetch<IStartSubscriptionCheckoutResult>(
      buildApiUrl(API_ENDPOINTS.user.subscriptionsStart),
      {
        method: 'POST',
        body: JSON.stringify({ subscriptionPlanId }),
      },
      cookieStorage
    );
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
