import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import type { IUserPaymentsPage } from '@/modules/user/payments/types/payments.types';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';
import { ApiResponse } from '@/types/api.index';
import { cookies } from 'next/headers';

export const paymentsService = {
  getUserPayments: async (params: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<ApiResponse<IUserPaymentsPage>> => {
    const cookieStorage = await cookies();
    const query = buildQuery({
      page: params.page,
      limit: params.limit,
      status: params.status ?? '',
    });
    return await apiFetch<IUserPaymentsPage>(
      `${buildApiUrl(API_ENDPOINTS.payments.list)}?${query}`,
      { method: 'GET' },
      cookieStorage
    );
  },

  declinePayment: async (params: {
    paymentId: string;
  }): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.payments.decline),
      {
        method: 'POST',
        body: JSON.stringify({ paymentId: params.paymentId }),
      },
      cookieStorage
    );
  },

  createPaymentOrder: async (params: {
    paymentId: string;
  }): Promise<ApiResponse<IPaymentGatewayOrder>> => {
    const cookieStorage = await cookies();
    return await apiFetch<IPaymentGatewayOrder>(
      buildApiUrl(API_ENDPOINTS.payments.createOrder),
      {
        method: 'POST',
        body: JSON.stringify({ paymentId: params.paymentId }),
      },
      cookieStorage
    );
  },

  verifyPayment: async (
    params: IVerifyGatewayPaymentInput
  ): Promise<ApiResponse<null>> => {
    const cookieStorage = await cookies();
    return await apiFetch<null>(
      buildApiUrl(API_ENDPOINTS.payments.verify),
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
      cookieStorage
    );
  },
};
