'use server';

import { paymentsService } from '@/services/user/payments.service';
import type { IUserPaymentsPage } from '@/features/user/payments/types/payments.types';
import { ApiResponse } from '@/types/api.index';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';

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
}): Promise<ApiResponse<IPaymentGatewayOrder>> => {
  return await paymentsService.createPaymentOrder(params);
};

export const verifyPaymentAction = async (
  params: IVerifyGatewayPaymentInput
): Promise<ApiResponse<null>> => {
  return await paymentsService.verifyPayment(params);
};
