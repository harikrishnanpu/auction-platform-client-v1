'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { AuctionCategory } from '@/types/auction.type';
import { AuctionCategoryStatus } from '@/types/auction.type';
import { requestAuctionCategoryAction } from '@/actions/seller/seller.action';
import { getErrorMessage } from '@/utils/get-app-error';

export type CategoryParentOption = { id: string; label: string };

function normalizeCategoryStatus(status: unknown): AuctionCategoryStatus {
  if (typeof status !== 'string') return AuctionCategoryStatus.PENDING;
  const v = status.trim().toUpperCase();
  if (v === AuctionCategoryStatus.APPROVED)
    return AuctionCategoryStatus.APPROVED;
  if (v === AuctionCategoryStatus.REJECTED)
    return AuctionCategoryStatus.REJECTED;
  return AuctionCategoryStatus.PENDING;
}

export function useSellerCategoryRequestForm(categories: AuctionCategory[]) {
  const router = useRouter();

  const parentOptions: CategoryParentOption[] = useMemo(() => {
    return categories.map((r) => ({
      id: r.id,
      label: r.name,
    }));
  }, [categories]);

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Please enter a category name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestAuctionCategoryAction({
        name: trimmed,
        parentId: parentId || null,
      });

      if (!res.success) throw new Error(res.error ?? 'Request failed');

      toast.success('Category request submitted for review.');
      setName('');
      setParentId('');
      router.push('/seller/auction/categories/request');
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [name, parentId, router]);

  return {
    name,
    setName,
    parentId,
    setParentId,
    submitting,
    parentOptions,
    onSubmit,
  };
}

export function useSellerMyCategoryRequests(requests: AuctionCategory[]) {
  const normalized = useMemo(() => {
    return (requests ?? []).map((r) => ({
      ...r,
      status: normalizeCategoryStatus(r.status),
      rejectionReason: r.rejectionReason ?? r.rejection_reason_message ?? '',
    }));
  }, [requests]);

  return { requests: normalized };
}
