'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  createAuctionAction,
  generateAuctionUploadUrlAction,
} from '@/actions/auction/auction.actions';
import type { AuctionAssetForm, AuctionType } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { datetimeLocalToISO } from '@/lib/datetime-local';
import {
  createAuctionFormSchema,
  type CreateAuctionFormValues,
} from '../schemas/create-auction.schema';

const VALID_TYPES: AuctionType[] = ['LONG', 'LIVE', 'SEALED'];

export interface PendingAsset {
  file: File;
  fileKey: string;
  position: number;
  assetType: 'IMAGE' | 'VIDEO';
  status: 'idle' | 'uploading' | 'done' | 'error';
  previewUrl: string;
}

const defaultValues: CreateAuctionFormValues = {
  title: '',
  description: '',
  categoryId: '',
  condition: '',
  startPrice: 0,
  minIncrement: 0,
  startAt: '',
  endAt: '',
  antiSnipSeconds: 60,
  maxExtensionCount: 3,
  bidCooldownSeconds: 10,
};

export function useCreateAuctionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const auctionType =
    typeParam && VALID_TYPES.includes(typeParam as AuctionType)
      ? (typeParam as AuctionType)
      : null;

  const [assets, setAssets] = useState<PendingAsset[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(
      createAuctionFormSchema
    ) as Resolver<CreateAuctionFormValues>,
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    return () => {
      assets.forEach((asset) => {
        if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
      });
    };
  }, [assets]);

  const categoryValue = form.watch('categoryId');

  const handleSelectType = useCallback(
    (type: AuctionType) => {
      router.replace(`/seller/auction/create?type=${type}`);
    },
    [router]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue('categoryId', value, { shouldValidate: true });
    },
    [form]
  );

  const handleAddFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      const valid = files.filter((f) => allowed.includes(f.type));
      if (valid.length !== files.length) {
        toast.error('Only JPEG, PNG, WebP images and MP4 video are allowed.');
      }

      const newAssets: PendingAsset[] = valid.map((file, i) => ({
        file,
        fileKey: '',
        position: assets.length + i,
        assetType: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        status: 'idle',
        previewUrl: URL.createObjectURL(file),
      }));

      setAssets((prev) => [...prev, ...newAssets]);
      e.target.value = '';
    },
    [assets.length]
  );

  const uploadOne = useCallback(
    async (index: number) => {
      setAssets((prev) => {
        const next = [...prev];
        if (next[index]) next[index] = { ...next[index], status: 'uploading' };
        return next;
      });

      setUploadError(null);
      const item = assets[index];
      if (!item || item.status !== 'idle' || item.fileKey) return;

      try {
        const urlRes = await generateAuctionUploadUrlAction({
          contentType: item.file.type,
          fileName: item.file.name,
          fileSize: item.file.size,
        });
        if (!urlRes.success || !urlRes.data) {
          throw new Error(urlRes.error ?? 'Failed to get upload URL');
        }
        const { uploadUrl, fileKey } = urlRes.data;
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': item.file.type },
          body: item.file,
        });

        if (!putRes.ok) throw new Error('Upload to storage failed');

        setAssets((prev) => {
          const next = [...prev];
          if (next[index])
            next[index] = { ...next[index], fileKey, status: 'done' };
          return next;
        });
      } catch (err) {
        setUploadError(getErrorMessage(err));
        setAssets((prev) => {
          const next = [...prev];
          if (next[index]) next[index] = { ...next[index], status: 'error' };
          return next;
        });
      }
    },
    [assets]
  );

  const removeAsset = useCallback((index: number) => {
    setAssets((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  }, []);

  const onSubmit = useCallback(
    async (data: CreateAuctionFormValues) => {
      if (!auctionType) return;

      const withKeys = assets.filter((a) => a.fileKey);

      if (assets.length > 0 && withKeys.length === 0) {
        toast.error('Please upload all selected files first.');
        return;
      }

      if (assets.some((a) => a.status === 'uploading')) {
        toast.error('Please wait for uploads to finish.');
        return;
      }

      const assetDtos: AuctionAssetForm[] = assets
        .filter((a) => a.fileKey)
        .map((a) => ({
          fileKey: a.fileKey,
          position: a.position,
          assetType: a.assetType,
        }));

      if (assetDtos.length === 0) {
        toast.error('Atleast One Asset Needed');
        form.setError('root', {
          message: 'Atleast One Asset Needed',
        });
        return;
      }

      try {
        const result = await createAuctionAction({
          auctionType,
          title: data.title.trim(),
          description: data.description?.trim() ?? '',
          categoryId: data.categoryId.trim(),
          condition: data.condition.trim(),
          startPrice: data.startPrice,
          minIncrement: data.minIncrement,
          startAt: datetimeLocalToISO(data.startAt),
          endAt: datetimeLocalToISO(data.endAt),
          antiSnipSeconds: data.antiSnipSeconds,
          maxExtensionCount: data.maxExtensionCount,
          bidCooldownSeconds: data.bidCooldownSeconds,
          assets: assetDtos.length ? assetDtos : undefined,
        });

        if (!result.success || !result.data) {
          form.setError('root', {
            message: result.error ?? 'Failed to create auction',
          });
          return;
        }

        toast.success('Auction created as draft.');
        router.push(`/seller/auction/${result.data.id}`);
      } catch (err) {
        form.setError('root', {
          message: getErrorMessage(err) ?? 'Something went wrong',
        });
      }
    },
    [assets, auctionType, form, router]
  );

  const submit = useMemo(() => form.handleSubmit(onSubmit), [form, onSubmit]);

  return {
    form,
    auctionType,
    categoryValue,
    assets,
    uploadError,
    handleSelectType,
    handleCategoryChange,
    handleAddFiles,
    uploadOne,
    removeAsset,
    submit,
  };
}
