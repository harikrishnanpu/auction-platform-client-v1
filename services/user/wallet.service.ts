import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import type {
  ICreateWalletTopupOrderResponse,
  IUserWallet,
} from '@/features/user/wallet/types/wallet.types';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import { cookies } from 'next/headers';

export const walletService = {
  getWallet: async (): Promise<ApiResponse<IUserWallet>> => {
    const cookieStorage = await cookies();
    return await apiFetch<IUserWallet>(
      buildApiUrl(API_ENDPOINTS.wallet.get),
      { method: 'GET' },
      cookieStorage
    );
  },

  createTopupOrder: async (params: {
    amount: number;
  }): Promise<ApiResponse<ICreateWalletTopupOrderResponse>> => {
    const cookieStorage = await cookies();
    return await apiFetch<ICreateWalletTopupOrderResponse>(
      buildApiUrl(API_ENDPOINTS.wallet.createTopupOrder),
      {
        method: 'POST',
        body: JSON.stringify({ amount: params.amount }),
      },
      cookieStorage
    );
  },

  verifyTopup: async (params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.wallet.verifyTopup),
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
      cookieStorage
    );
  },

  withdraw: async (params: { amount: number }): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.wallet.withdraw),
      {
        method: 'POST',
        body: JSON.stringify({ amount: params.amount }),
      },
      cookieStorage
    );
  },
};
