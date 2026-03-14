'use client';

import { useState, useCallback, useMemo } from 'react';
import { AUCTION_CATEGORIES } from '@/lib/auction-utils';

const CATEGORY_OPTIONS = ['All', ...AUCTION_CATEGORIES] as const;
const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'LONG', label: 'Long' },
  { value: 'LIVE', label: 'Live' },
  { value: 'SEALED', label: 'Sealed' },
] as const;

export type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];
export type TypeFilterValue = '' | 'LONG' | 'LIVE' | 'SEALED';

export interface AuctionListFiltersState {
  search: string;
  category: CategoryFilter;
  typeFilter: TypeFilterValue;
}

const initialFilters: AuctionListFiltersState = {
  search: '',
  category: 'All',
  typeFilter: '',
};

export function useAuctionListFilters(
  initial?: Partial<AuctionListFiltersState>
) {
  const [filters, setFilters] = useState<AuctionListFiltersState>({
    ...initialFilters,
    ...initial,
  });

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: CategoryFilter) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setTypeFilter = useCallback((value: TypeFilterValue) => {
    setFilters((prev) => ({ ...prev, typeFilter: value }));
  }, []);

  const queryFilters = useMemo(
    () => ({
      category: filters.category !== 'All' ? filters.category : undefined,
      auctionType: filters.typeFilter || undefined,
    }),
    [filters.category, filters.typeFilter]
  );

  return {
    filters,
    setSearch,
    setCategory,
    setTypeFilter,
    queryFilters,
    categoryOptions: CATEGORY_OPTIONS,
    typeOptions: TYPE_OPTIONS,
  };
}
