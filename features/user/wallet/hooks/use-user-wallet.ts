'use client';

import {
  createWalletTopupOrderAction,
  getWalletAction,
  verifyWalletTopupAction,
  withdrawWalletAction,
} from '@/actions/user/wallet.actions';
import { useCallback, useEffect, useState } from 'react';
import type {
  ICreateWalletTopupOrderResponse,
  IUserWallet,
} from '../types/wallet.types';

export function useUserWallet() {
  const [wallet, setWallet] = useState<IUserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWalletAction();

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load wallet');
      }

      setWallet(result.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load wallet');
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWallet();
  }, [fetchWallet]);

  const createTopupOrder = useCallback(
    async (amount: number): Promise<ICreateWalletTopupOrderResponse> => {
      const result = await createWalletTopupOrderAction({ amount });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to create top-up order');
      }
      return result.data;
    },
    []
  );

  const verifyTopup = useCallback(
    async (input: {
      orderId: string;
      paymentId: string;
      signature: string;
    }) => {
      const result = await verifyWalletTopupAction(input);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to verify top-up payment');
      }
      await fetchWallet();
    },
    [fetchWallet]
  );

  const withdraw = useCallback(
    async (amount: number) => {
      const result = await withdrawWalletAction({ amount });
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to withdraw wallet amount');
      }
      await fetchWallet();
    },
    [fetchWallet]
  );

  return {
    wallet,
    loading,
    error,
    refresh: fetchWallet,
    createTopupOrder,
    verifyTopup,
    withdraw,
  };
}
