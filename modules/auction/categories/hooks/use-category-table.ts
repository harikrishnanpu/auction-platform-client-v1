'use client';

import { useEffect, useMemo, useState } from 'react';

import { AuctionCategory, AuctionCategoryStatus } from '@/types/auction.type';
import { CategoryParentOption } from '@/modules/admin/auctions/components/categories/category-modals';

export function normalizeCategoryStatus(
  status: unknown
): AuctionCategoryStatus {
  if (typeof status !== 'string') return AuctionCategoryStatus.PENDING;
  const v = status.trim().toUpperCase();
  if (v === AuctionCategoryStatus.APPROVED)
    return AuctionCategoryStatus.APPROVED;
  if (v === AuctionCategoryStatus.REJECTED)
    return AuctionCategoryStatus.REJECTED;
  return AuctionCategoryStatus.PENDING;
}

const CATEGORY_SEARCH_DEBOUNCE_MS = 400;

export function useCategoryTableFilters(items: AuctionCategory[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | AuctionCategoryStatus
  >('ALL');

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, CATEGORY_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  const filteredItems = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return items.filter((c) => {
      const status = normalizeCategoryStatus(c.status);
      const statusOk = statusFilter === 'ALL' ? true : status === statusFilter;
      if (!statusOk) return false;
      if (!q) return true;
      const parent = c.parentId ?? '';
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        parent.toLowerCase().includes(q)
      );
    });
  }, [items, debouncedQuery, statusFilter]);

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    filteredItems,
  };
}

export function useCategoryParentOptions(categories: AuctionCategory[]) {
  const parentOptions = useMemo<CategoryParentOption[]>(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  const parentNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  return { parentOptions, parentNameById };
}
