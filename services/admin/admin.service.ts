import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { IgetllSellersParams, IgetllUsersParams } from '@/types/admin.type';
import { ApiResponse } from '@/types/api.index';
import { IUser } from '@/types/user.type';
import { KycProfile } from '@/types/kyc.type';
import { IAdminDashboardStats } from '@/types/admin-dashboard.type';
import { ISystemConfig } from '@/types/system-config.type';
import { ISubscribedUser, ISubscriptionPlan } from '@/types/subscription.type';
import { getErrorMessage } from '@/utils/get-app-error';

export interface SellerInfo extends IUser {
  kyc?: KycProfile;
  kycStatus?: string;
}

export const adminService = {
  getDashboardStats: async (
    cookieString: string
  ): Promise<ApiResponse<IAdminDashboardStats>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getDashboardStats),
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
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getAllUsers: async (
    input: IgetllUsersParams,
    cookieString: string
  ): Promise<
    ApiResponse<{
      users: IUser[];
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
  ): Promise<ApiResponse<IUser>> => {
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

      const user: IUser = response.data?.user ?? response.data;
      return { success: true, data: user };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getAllSellers: async (
    input: IgetllSellersParams,
    cookieString: string
  ): Promise<
    ApiResponse<{
      sellers: SellerInfo[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > => {
    try {
      const params = buildQuery(input);

      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.admin.getAllSellers}?${params}`),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getAdminSeller: async (
    cookieString: string,
    id: string
  ): Promise<ApiResponse<SellerInfo>> => {
    try {
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.admin.getAdminSeller}/${id}`),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      const raw = response.data?.seller ?? response.data;
      const kyc = raw?.kyc
        ? {
            ...raw.kyc,
            rejection_reason_message:
              raw.kyc.rejectionReason ?? raw.kyc.rejection_reason_message,
          }
        : undefined;
      const seller: SellerInfo = {
        ...raw,
        kycStatus: raw?.kycStatus ?? raw?.kyc?.status,
        kyc,
      };
      return { success: true, data: seller };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  approveSellerKyc: async (
    sellerId: string,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(
          `${API_ENDPOINTS.admin.getAdminSeller}/${sellerId}/kyc/approve`
        ),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  rejectSellerKyc: async (
    sellerId: string,
    reason: string,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(
          `${API_ENDPOINTS.admin.getAdminSeller}/${sellerId}/kyc/reject`
        ),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify({ reason }),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  getSystemConfigs: async (
    cookieString: string
  ): Promise<ApiResponse<{ configs: ISystemConfig[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getSystemConfigs),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  getSystemConfigKeys: async (
    cookieString: string
  ): Promise<ApiResponse<{ keys: string[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getSystemConfigKeys),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  createSystemConfig: async (
    input: { key: string; value: string; description?: string | null },
    cookieString: string
  ): Promise<ApiResponse<ISystemConfig>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.createSystemConfig),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  editSystemConfig: async (
    input: { key: string; value: string; description?: string | null },
    cookieString: string
  ): Promise<ApiResponse<ISystemConfig>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.editSystemConfig),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  createSubscriptionPlan: async (
    input: {
      name: string;
      description: string;
      price: number;
      durationDays: number;
      features: {
        featureKey: string;
        value: string;
        type: 'BOOLEAN' | 'NUMBER' | 'STRING';
      }[];
    },
    cookieString: string
  ): Promise<ApiResponse<ISubscriptionPlan>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.createSubscriptionPlan),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  getSubscriptionPlans: async (
    cookieString: string
  ): Promise<ApiResponse<{ plans: ISubscriptionPlan[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getSubscriptionPlans),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  getSubscribedUsers: async (
    cookieString: string
  ): Promise<ApiResponse<{ subscriptions: ISubscribedUser[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getSubscribedUsers),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
  getSubscriptionFeatureMetadata: async (
    cookieString: string
  ): Promise<ApiResponse<{ featureKeys: string[]; valueTypes: string[] }>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.admin.getSubscriptionFeatureMetadata),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);

      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
};
