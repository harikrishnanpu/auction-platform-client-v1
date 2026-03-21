'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Gavel, Loader2 } from 'lucide-react';

import type {
  AuctionAssetType,
  AuctionCategory,
  IAuctionDto,
} from '@/types/auction.type';
import { SellerCategorySelect } from './category-select';
import { AUCTION_CONDITIONS, getAuctionTypeLabel } from '@/lib/auction-utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  createAuctionFormSchema,
  type CreateAuctionFormValues,
} from '../schemas/create-auction.schema';
import {
  publishSellerAuctionAction,
  updateSellerAuctionDraftAction,
  generateAuctionUploadUrlAction,
} from '@/actions/auction/auction.actions';
import type { UpdateAuctionDraftInput } from '@/types/auction.type';
import { isoToDatetimeLocal, datetimeLocalToISO } from '@/lib/datetime-local';
import { getErrorMessage } from '@/utils/get-app-error';
import type { AuctionAssetEditorItem } from './seller-auction-assets-editor';
import { SellerAuctionAssetsEditor } from './seller-auction-assets-editor';

export function SellerAuctionEditDraftContainer({
  auction,
  categories,
}: {
  auction: IAuctionDto;
  categories: AuctionCategory[];
}) {
  const router = useRouter();

  const [assets, setAssets] = useState<AuctionAssetEditorItem[]>(() =>
    (auction.assets ?? []).map((a, i) => ({
      id: `${a.fileKey}-${i}`,
      fileKey: a.fileKey,
      position: a.position ?? i,
      assetType: a.assetType as AuctionAssetType,
      status: 'done',
    }))
  );

  useEffect(() => {
    return () => {
      assets.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auctionType = auction.auctionType;
  const typeLabel = getAuctionTypeLabel(auctionType);

  const form = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(
      createAuctionFormSchema
    ) as Resolver<CreateAuctionFormValues>,
    mode: 'onBlur',
    defaultValues: {
      title: auction.title ?? '',
      description: auction.description ?? '',
      categoryId: auction.category?.id ?? '',
      condition: auction.condition ?? '',
      startPrice: auction.startPrice ?? 0,
      minIncrement: auction.minIncrement ?? 0,
      startAt: isoToDatetimeLocal(auction.startAt),
      endAt: isoToDatetimeLocal(auction.endAt),
      antiSnipSeconds: auction.antiSnipSeconds ?? 60,
      maxExtensionCount: auction.maxExtensionCount ?? 3,
      bidCooldownSeconds: auction.bidCooldownSeconds ?? 10,
    },
  });

  const categoryValue = form.watch('categoryId');

  const handleAddFiles = useCallback(
    (files: FileList | null) => {
      const list = Array.from(files ?? []);
      if (!list.length) return;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      const valid = list.filter((f) => allowed.includes(f.type));

      if (valid.length !== list.length) {
        toast.error('Only JPEG, PNG, WebP images and MP4 video are allowed.');
      }

      const startPos = assets.length;
      const newAssets = valid.map((file, idx) => {
        const assetType = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
        return {
          id: `${file.name}-${Date.now()}-${idx}`,
          file,
          position: startPos + idx,
          assetType,
          status: 'idle',
          previewUrl: URL.createObjectURL(file),
        } as AuctionAssetEditorItem;
      });

      setAssets((prev) => [...prev, ...newAssets]);
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
      if (!item?.file || item.status !== 'idle') return;

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
          if (!next[index]) return next;
          next[index] = {
            ...next[index],
            status: 'done',
            fileKey,
            file: undefined,
          };
          return next;
        });
      } catch (err: unknown) {
        const msg = getErrorMessage(err) ?? 'Upload failed';
        setUploadError(msg);
        toast.error(msg);
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
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      const next = prev.filter((_, i) => i !== index);
      return next.map((a, i) => ({ ...a, position: a.position ?? i }));
    });
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const submit = useMemo(
    () =>
      form.handleSubmit(async (data) => {
        if (submitting) return;

        form.clearErrors('root');

        const uploadedAssets = assets.filter((a) => a.fileKey);
        if (uploadedAssets.length === 0) {
          const msg = 'At least one image or video is required.';
          toast.error(msg);
          form.setError('root', { message: msg });
          return;
        }
        if (assets.some((a) => a.status === 'uploading')) {
          const msg = 'Please wait for uploads to finish.';
          toast.error(msg);
          form.setError('root', { message: msg });
          return;
        }

        setSubmitting(true);
        try {
          const payload: UpdateAuctionDraftInput = {
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
            assets: uploadedAssets.map((a) => ({
              fileKey: a.fileKey!,
              position: a.position,
              assetType: a.assetType,
            })),
          };

          const res = await updateSellerAuctionDraftAction(auction.id, payload);
          if (!res.success) {
            const msg = res.error ?? 'Failed to update draft';
            form.setError('root', { message: msg });
            toast.error(msg);
            return;
          }

          toast.success('Draft updated.');
          router.push(`/seller/auction/${auction.id}/draft`);
        } catch (err) {
          const msg = getErrorMessage(err) ?? 'Something went wrong';
          form.setError('root', { message: msg });
          toast.error(msg);
        } finally {
          setSubmitting(false);
        }
      }),
    [assets, auction.id, auctionType, form, router, submitting]
  );

  const onPublish = useCallback(async () => {
    form.clearErrors('root');
    setSubmitting(true);
    try {
      const res = await publishSellerAuctionAction(auction.id);
      if (!res.success) {
        const msg = res.error ?? 'Failed to publish draft';
        form.setError('root', { message: msg });
        toast.error(msg);
        return;
      }
      toast.success('Auction published.');
      router.push(`/seller/auction/${auction.id}`);
    } catch (err) {
      const msg = getErrorMessage(err) ?? 'Something went wrong';
      form.setError('root', { message: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [auction.id, form, router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="outline" asChild className="h-8 text-xs">
            <Link href={`/seller/auction/${auction.id}/draft`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to draft
            </Link>
          </Button>

          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Editing {typeLabel} draft
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update fields, media, then save or publish.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/seller/auction/${auction.id}/draft`)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onPublish} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Gavel className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {form.formState.errors.root ? (
        <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
          {form.formState.errors.root.message}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Auction details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Auction title"
                disabled={submitting}
                className="mt-1"
              />
              {form.formState.errors.title ? (
                <p className="text-destructive text-xs mt-1">
                  {form.formState.errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...form.register('description')}
                rows={4}
                disabled={submitting}
                className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {form.formState.errors.description ? (
                <p className="text-destructive text-xs mt-1">
                  {form.formState.errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="category">Category</Label>
                <SellerCategorySelect
                  id="category"
                  value={categoryValue}
                  categories={categories}
                  onChange={(v) =>
                    form.setValue('categoryId', v, { shouldValidate: true })
                  }
                  disabled={submitting}
                  error={form.formState.errors.categoryId?.message}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  {...form.register('condition')}
                  disabled={submitting}
                  className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select condition</option>
                  {AUCTION_CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {form.formState.errors.condition ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.condition.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startPrice">Start price (₹)</Label>
                <Input
                  id="startPrice"
                  type="number"
                  step="any"
                  {...form.register('startPrice')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.startPrice ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.startPrice.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="minIncrement">Min increment (₹)</Label>
                <Input
                  id="minIncrement"
                  type="number"
                  step="any"
                  {...form.register('minIncrement')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.minIncrement ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.minIncrement.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startAt">Start time</Label>
                <Input
                  id="startAt"
                  type="datetime-local"
                  {...form.register('startAt')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.startAt ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.startAt.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="endAt">End time</Label>
                <Input
                  id="endAt"
                  type="datetime-local"
                  {...form.register('endAt')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.endAt ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.endAt.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="antiSnipSeconds">Anti-snip (seconds)</Label>
                <Input
                  id="antiSnipSeconds"
                  type="number"
                  step={1}
                  {...form.register('antiSnipSeconds')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.antiSnipSeconds ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.antiSnipSeconds.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="maxExtensionCount">Max extensions</Label>
                <Input
                  id="maxExtensionCount"
                  type="number"
                  step={1}
                  {...form.register('maxExtensionCount')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.maxExtensionCount ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.maxExtensionCount.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="bidCooldownSeconds">
                  Bid cooldown (seconds)
                </Label>
                <Input
                  id="bidCooldownSeconds"
                  type="number"
                  step={1}
                  {...form.register('bidCooldownSeconds')}
                  disabled={submitting}
                  className="mt-1"
                />
                {form.formState.errors.bidCooldownSeconds ? (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.bidCooldownSeconds.message}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent>
            <SellerAuctionAssetsEditor
              items={assets}
              disabled={submitting}
              onAddFiles={handleAddFiles}
              onUploadOne={uploadOne}
              onRemoveOne={removeAsset}
            />
            {uploadError ? (
              <p className="mt-3 text-sm text-destructive">{uploadError}</p>
            ) : null}
            <p className="mt-3 text-[11px] text-muted-foreground">
              Existing media can be removed; new media can be uploaded.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save draft'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
