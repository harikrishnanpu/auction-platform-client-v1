'use client';

import Link from 'next/link';
import { Loader2, Save, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AUCTION_CATEGORIES,
  AUCTION_CONDITIONS,
  getAuctionImageUrl,
  getAuctionTypeLabel,
} from '@/lib/auction-utils';
import type { AuctionDetail } from '@/types/auction.type';
import { useEditDraftAuctionForm } from '../hooks/use-edit-draft-auction-form';

export interface EditDraftAuctionFormProps {
  auctionId: string;
  initialAuction?: AuctionDetail | null;
  error?: string | null;
}

export function EditDraftAuctionForm({
  auctionId,
  initialAuction = null,
  error: initialError = null,
}: EditDraftAuctionFormProps) {
  const {
    form,
    auction,
    loading,
    publishing,
    handleSave,
    handlePublish,
    handleDelete,
    sortedAssets,
  } = useEditDraftAuctionForm(auctionId, initialAuction);

  const error = initialError;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">{error ?? 'Auction not found.'}</p>
        <Button variant="outline" asChild>
          <Link href="/seller/auction">Back to list</Link>
        </Button>
      </div>
    );
  }

  if (auction.status !== 'DRAFT') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Only draft auctions can be edited.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/seller/auction/${auctionId}`}>View auction</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">
          Edit draft auction
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Update details below. Media cannot be changed after creation.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSave)}>
        {errors.root && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {errors.root.message}
          </div>
        )}
        <Card className="rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="auctionType">Auction type</Label>
              <select
                id="auctionType"
                {...register('auctionType')}
                className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="LONG">{getAuctionTypeLabel('LONG')}</option>
                <option value="LIVE">{getAuctionTypeLabel('LIVE')}</option>
                <option value="SEALED">{getAuctionTypeLabel('SEALED')}</option>
              </select>
              {errors.auctionType && (
                <p className="text-destructive text-xs mt-1">
                  {errors.auctionType.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} className="mt-1" />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.description && (
                <p className="text-destructive text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register('category')}
                  className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {AUCTION_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  {...register('condition')}
                  className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {AUCTION_CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startPrice">Start price (₹)</Label>
                <Input
                  id="startPrice"
                  type="number"
                  min={0}
                  step="any"
                  {...register('startPrice')}
                  className="mt-1"
                />
                {errors.startPrice && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.startPrice.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="minIncrement">Min increment (₹)</Label>
                <Input
                  id="minIncrement"
                  type="number"
                  min={0}
                  step="any"
                  {...register('minIncrement')}
                  className="mt-1"
                />
                {errors.minIncrement && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.minIncrement.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startAt">Start time</Label>
                <Input
                  id="startAt"
                  type="datetime-local"
                  {...register('startAt')}
                  className="mt-1"
                />
                {errors.startAt && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.startAt.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endAt">End time</Label>
                <Input
                  id="endAt"
                  type="datetime-local"
                  {...register('endAt')}
                  className="mt-1"
                />
                {errors.endAt && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.endAt.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="antiSnipSeconds">Anti-snip (seconds)</Label>
                <Input
                  id="antiSnipSeconds"
                  type="number"
                  min={0}
                  step={1}
                  {...register('antiSnipSeconds')}
                  className="mt-1"
                />
                {errors.antiSnipSeconds && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.antiSnipSeconds.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="maxExtensionCount">Max extensions</Label>
                <Input
                  id="maxExtensionCount"
                  type="number"
                  min={0}
                  step={1}
                  {...register('maxExtensionCount')}
                  className="mt-1"
                />
                {errors.maxExtensionCount && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.maxExtensionCount.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="bidCooldownSeconds">
                  Bid cooldown (seconds)
                </Label>
                <Input
                  id="bidCooldownSeconds"
                  type="number"
                  min={0}
                  step={1}
                  {...register('bidCooldownSeconds')}
                  className="mt-1"
                />
                {errors.bidCooldownSeconds && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.bidCooldownSeconds.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Media</CardTitle>
            <p className="text-sm text-muted-foreground">
              Media files cannot be modified after creation.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {sortedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted/30"
                >
                  {asset.assetType === 'VIDEO' ? (
                    <video
                      src={getAuctionImageUrl(asset.fileKey)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getAuctionImageUrl(asset.fileKey)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {sortedAssets.length === 0 && (
                <p className="text-sm text-muted-foreground">No media.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save changes
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Publish
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete draft
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link href={`/seller/auction/${auctionId}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
