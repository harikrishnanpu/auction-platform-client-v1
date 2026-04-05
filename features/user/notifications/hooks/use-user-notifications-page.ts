'use client';

import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { useCallback, useEffect, useState } from 'react';
import type { IUserNotificationsPage } from '../types/notifications.types';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export function useUserNotificationsPage({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const [data, setData] = useState<IUserNotificationsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQuery({ page, limit });
      const url = `${buildApiUrl(API_ENDPOINTS.user.notifications)}?${query}`;
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to load notifications');
      }

      const payload = (await res.json()) as ApiEnvelope<IUserNotificationsPage>;
      setData(payload.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  return { data, loading, error, refresh: fetchPage };
}
