import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { IgetllUsersParams } from '@/types/admin.type';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const adminService = {
  getAllUsers: async (
    input: IgetllUsersParams,
    cookieString: string
  ): Promise<
    ApiResponse<{
      users: UserInfo[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      currentPage: number;
    }>
  > => {
    try {
      const params = buildQuery(input);

      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.admin.getAllUsers}?${params}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieString,
          },
          credentials: 'include',
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error);
      }

      if (!response.success) {
        throw new Error(response.error);
      }
      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  blockUser: async (
    id: string,
    block: boolean,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.admin.blockUser}/${id}`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieString,
          },
          credentials: 'include',
          body: JSON.stringify({ block }),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error);
      }

      if (!response.success) {
        throw new Error(response.error);
      }
      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getAdminUser: async (
    cookieString: string,
    id: string
  ): Promise<ApiResponse<UserInfo>> => {
    try {
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.admin.getAdminUser}/${id}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieString,
          },
          credentials: 'include',
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error ?? response.message);
      }

      if (!response.success) {
        throw new Error(response.error ?? response.message);
      }

      const user: UserInfo = response.data?.user ?? response.data;
      return { success: true, data: user };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
};
