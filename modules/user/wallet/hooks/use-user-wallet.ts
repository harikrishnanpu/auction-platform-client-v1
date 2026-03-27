'use client';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { useCallback, useEffect, useState } from 'react';
import type { IUserWallet } from '../types/wallet.types';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export function useUserWallet() {
  const [wallet, setWallet] = useState<IUserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.user.wallet), {
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

  return { wallet, loading, error, refresh: fetchWallet };
}
