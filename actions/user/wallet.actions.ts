'use server';

import type {
  ICreateWalletTopupOrderResponse,
  IUserWallet,
} from '@/modules/user/wallet/types/wallet.types';
import { walletService } from '@/services/user/wallet.service';
import { ApiResponse } from '@/types/api.index';

export const getWalletAction = async (): Promise<ApiResponse<IUserWallet>> => {
  return await walletService.getWallet();
};

export const createWalletTopupOrderAction = async (params: {
  amount: number;
}): Promise<ApiResponse<ICreateWalletTopupOrderResponse>> => {
  return await walletService.createTopupOrder(params);
};

export const verifyWalletTopupAction = async (params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<ApiResponse<null>> => {
  return await walletService.verifyTopup(params);
};

export const withdrawWalletAction = async (params: {
  amount: number;
}): Promise<ApiResponse<null>> => {
  return await walletService.withdraw(params);
};
