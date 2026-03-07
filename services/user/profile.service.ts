import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<UserInfo>> => {
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.user.profile));
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },

  getAvatarUploadUrl: async (): Promise<ApiResponse<string>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.user.getAvatarUploadUrl)
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    } catch (error: unknown) {
      return { success: false, data: null, error: getErrorMessage(error) };
    }
  },
};
