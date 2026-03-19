'use client';

import { useMemo, useState } from 'react';

import { AuctionCategory, AuctionCategoryStatus } from '@/types/auction.type';
import { CategoryParentOption } from './category-modals';

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

export function useCategoryTableFilters(items: AuctionCategory[]) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | AuctionCategoryStatus
  >('ALL');

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
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
  }, [items, query, statusFilter]);

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
    () =>
      categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
    [categories]
  );

  const parentNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  return { parentOptions, parentNameById };
}
