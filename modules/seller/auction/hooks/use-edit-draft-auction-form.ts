'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getAuctionByIdAction,
  updateAuctionAction,
  publishAuctionAction,
} from '@/actions/auction/auction.actions';
import type { AuctionDetail } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { toast } from 'sonner';
import {
  updateAuctionFormSchema,
  type UpdateAuctionFormValues,
} from '../schemas/update-auction.schema';

function toFormValues(a: AuctionDetail): UpdateAuctionFormValues {
  return {
    auctionType: a.auctionType,
    title: a.title,
    description: a.description ?? '',
    category: a.category,
    condition: a.condition,
    startPrice: a.startPrice,
    minIncrement: a.minIncrement,
    startAt: a.startAt.slice(0, 16),
    endAt: a.endAt.slice(0, 16),
    antiSnipSeconds: a.antiSnipSeconds ?? 60,
    maxExtensionCount: a.maxExtensionCount ?? 3,
    bidCooldownSeconds: a.bidCooldownSeconds ?? 10,
  };
}

export function useEditDraftAuctionForm(
  auctionId: string,
  initialAuction?: AuctionDetail | null
) {
  const router = useRouter();

  const form = useForm<UpdateAuctionFormValues>({
    resolver: zodResolver(
      updateAuctionFormSchema
    ) as Resolver<UpdateAuctionFormValues>,
    defaultValues: {
      auctionType: 'LONG',
      title: '',
      description: '',
      category: '',
      condition: '',
      startPrice: 0,
      minIncrement: 0,
      startAt: '',
      endAt: '',
      antiSnipSeconds: 60,
      maxExtensionCount: 3,
      bidCooldownSeconds: 10,
    },
    mode: 'onBlur',
  });

  const { data: auction, loading } = useAuctionById(auctionId, initialAuction);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (auction) form.reset(toFormValues(auction));
  }, [auction, form]);

  const handleSave = useCallback(
    async (data: UpdateAuctionFormValues) => {
      if (!auction || auction.status !== 'DRAFT') {
        toast.error('Only draft auctions can be edited.');
        return;
      }
      try {
        const result = await updateAuctionAction(auctionId, {
          auctionType: data.auctionType,
          title: data.title.trim(),
          description: data.description?.trim() ?? '',
          category: data.category.trim(),
          condition: data.condition.trim(),
          startPrice: data.startPrice,
          minIncrement: data.minIncrement,
          startAt: new Date(data.startAt).toISOString(),
          endAt: new Date(data.endAt).toISOString(),
          antiSnipSeconds: data.antiSnipSeconds,
          maxExtensionCount: data.maxExtensionCount,
          bidCooldownSeconds: data.bidCooldownSeconds,
        });
        if (!result.success || !result.data) {
          form.setError('root', {
            message: result.error ?? 'Failed to update auction',
          });
          return;
        }
        toast.success('Auction updated.');
        router.push(`/seller/auction/${auctionId}`);
      } catch (err) {
        form.setError('root', {
          message: getErrorMessage(err) ?? 'Something went wrong',
        });
      }
    },
    [auction, auctionId, form, router]
  );

  const handlePublish = useCallback(async () => {
    if (!auction) return;
    setPublishing(true);
    try {
      const result = await publishAuctionAction(auctionId);
      if (!result.success) {
        toast.error(result.error ?? 'Failed to publish auction');
        return;
      }
      toast.success('Auction published. It is now live.');
      router.push(`/seller/auction/${auctionId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPublishing(false);
    }
  }, [auction, auctionId, router]);

  const handleDelete = useCallback(() => {
    toast.info('Delete coming soon.');
  }, []);

  const sortedAssets = auction
    ? [...auction.assets].sort((a, b) => a.position - b.position)
    : [];

  return {
    form,
    auction,
    loading,
    publishing,
    handleSave,
    handlePublish,
    handleDelete,
    sortedAssets,
  };
}

function useAuctionById(
  auctionId: string,
  initialAuction?: AuctionDetail | null
) {
  const [data, setData] = useState<AuctionDetail | null>(
    initialAuction ?? null
  );
  const [loading, setLoading] = useState(!initialAuction);

  useEffect(() => {
    if (initialAuction != null) return;
    let cancelled = false;
    getAuctionByIdAction(auctionId).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) setData(res.data);
      else setData(null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [auctionId, initialAuction]);

  return { data, loading };
}
