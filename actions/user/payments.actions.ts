'use server';

import { paymentsService } from '@/services/user/payments.service';
import type {
  ICreatePaymentOrderResponse,
  IUserPaymentsPage,
} from '@/modules/user/payments/types/payments.types';
import { ApiResponse } from '@/types/api.index';

export const getUserPaymentsAction = async (params: {
  page: number;
  limit: number;
  status?: string;
}): Promise<ApiResponse<IUserPaymentsPage>> => {
  return await paymentsService.getUserPayments(params);
};

export const declinePaymentAction = async (params: {
  paymentId: string;
}): Promise<ApiResponse<null>> => {
  return await paymentsService.declinePayment(params);
};

export const createPaymentOrderAction = async (params: {
  paymentId: string;
}): Promise<ApiResponse<ICreatePaymentOrderResponse>> => {
  return await paymentsService.createPaymentOrder(params);
};

export const verifyPaymentAction = async (params: {
  paymentId: string;
  orderId: string;
  gatewayPaymentId: string;
  signature: string;
}): Promise<ApiResponse<null>> => {
  return await paymentsService.verifyPayment(params);
};
