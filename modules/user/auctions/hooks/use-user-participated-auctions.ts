'use client';

import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  IGetMyAuctionsFilter,
  IGetMyAuctionsResponse,
} from '@/types/auction.type';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const DEFAULT_FILTERS: IGetMyAuctionsFilter = {
  page: 1,
  limit: 10,
  search: '',
  auctionType: 'ALL',
  status: 'ALL',
  sort: 'startAt',
  order: 'desc',
};

export function useUserParticipatedAuctions() {
  const [filters, setFilters] = useState<IGetMyAuctionsFilter>(DEFAULT_FILTERS);
  const [data, setData] = useState<IGetMyAuctionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQuery(filters);
      const url = `${buildApiUrl(API_ENDPOINTS.user.myAuctions)}?${query}`;

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to load my auctions');

      const payload = (await res.json()) as ApiEnvelope<IGetMyAuctionsResponse>;
      setData(payload.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load my auctions');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchAuctions();
  }, [fetchAuctions]);

  const updateFilter = useCallback(
    <K extends keyof IGetMyAuctionsFilter>(
      key: K,
      value: IGetMyAuctionsFilter[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === 'page' ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.auctionType !== 'ALL') count++;
    if (filters.status !== 'ALL') count++;
    if (filters.sort !== 'startAt') count++;
    if (filters.order !== 'desc') count++;
    if (filters.limit !== 10) count++;
    return count;
  }, [filters]);

  return {
    filters,
    data,
    loading,
    error,
    updateFilter,
    resetFilters,
    activeFilterCount,
    refresh: fetchAuctions,
  };
}
