'use client';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { useCallback, useEffect, useState } from 'react';
import type { IUserWallet } from '../types/wallet.types';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type TopupOrderResponse = {
  orderId: string;
  amountInPaise: number;
  currency: string;
  gatewayKey: string;
};

export function useUserWallet() {
  const [wallet, setWallet] = useState<IUserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.wallet.get), {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to load wallet');

      const payload = (await res.json()) as ApiEnvelope<IUserWallet>;
      setWallet(payload.data);
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

  const createTopupOrder = useCallback(async (amount: number) => {
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.wallet.createTopupOrder),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      }
    );

    if (!res.ok) throw new Error('Failed to create top-up order');

    const payload = (await res.json()) as ApiEnvelope<TopupOrderResponse>;
    return payload.data;
  }, []);

  const verifyTopup = useCallback(
    async (input: {
      orderId: string;
      paymentId: string;
      signature: string;
    }) => {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.wallet.verifyTopup), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) throw new Error('Failed to verify top-up payment');

      await fetchWallet();
    },
    [fetchWallet]
  );

  const withdraw = useCallback(
    async (amount: number) => {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.wallet.withdraw), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error('Failed to withdraw wallet amount');

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
