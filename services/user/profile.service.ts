import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ChangePasswordFormValues } from '@/modules/profile/schemes/changeprofilePassword.schema';
import { EditProfileFormValues } from '@/modules/profile/schemes/editProfile.schema';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<UserInfo>> => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.user.profile));

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  editProfile: async (
    data: EditProfileFormValues
  ): Promise<ApiResponse<{ user: UserInfo }>> => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.editProfile),
        {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const responseData = await response.json();

      return { success: true, data: responseData.data };
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  sendProfileChangePasswordOtp: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.sendProfileChangePasswordOtp),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  changeProfilePassword: async (
    data: ChangePasswordFormValues
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.changeProfilePassword),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  editProfileSendOtp: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.editProfileSendOtp),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return { success: true, data: null };
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
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
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.getAvatarUploadUrl),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            contentType: contentType,
            fileName: fileName,
            fileSize: fileSize,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const responseData = await response.json();

      return { success: true, data: responseData.data };
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
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
  ): Promise<ApiResponse<{ user: UserInfo }>> => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.updateAvatar),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            fileKey: fileKey,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const responseData = await response.json();

      return { success: true, data: responseData.data };
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },
};
