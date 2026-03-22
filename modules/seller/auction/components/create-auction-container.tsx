'use client';

import Link from 'next/link';
import { Gavel, Upload, Loader2, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AUCTION_CONDITIONS, getAuctionTypeLabel } from '@/utils/auction-utils';
import type { AuctionCategory } from '@/types/auction.type';
import { useCreateAuctionForm } from '../hooks/use-create-auction-form';
import { AuctionTypeSelector } from './auction-type-selector';
import { SellerCategorySelect } from './category-select';
import {
  AuctionBidRuleThreeColumnFields,
  sealedBidInputProps,
} from './auction-bid-rule-fields';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function CreateAuctionContainer({
  categories,
}: {
  categories: AuctionCategory[];
}) {
  const {
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
  } = useCreateAuctionForm();

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  const isSealed = auctionType === 'SEALED';
  const sealedField = sealedBidInputProps(isSealed, isSubmitting);

  if (!auctionType) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
        <main className="grow max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold  text-slate-900 dark:text-white mb-2">
              Create Auction
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Choose an auction type to get started.
            </p>
          </div>
          <AuctionTypeSelector onSelect={handleSelectType} />
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/seller/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const typeLabel = getAuctionTypeLabel(auctionType);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
      <main className="grow max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/seller/auction/create"
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Change type
            </Link>
          </Button>
          <h1 className="text-3xl font-bold  text-slate-900 dark:text-white mb-2 mt-2">
            Creating {typeLabel} auction
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Add details and media. You can save as draft and publish when ready.
          </p>
        </div>

        <form onSubmit={submit}>
          {errors.root && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {errors.root.message}
            </div>
          )}
          <Card className="rounded-2xl mb-6">
            <CardHeader>
              <CardTitle className="text-lg ">Auction details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add details and media. You can save as draft and publish when
                ready.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Auction title"
                  className="mt-1"
                />
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
                  placeholder="Describe the item..."
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
                  <SellerCategorySelect
                    id="category"
                    value={categoryValue}
                    categories={categories}
                    onChange={handleCategoryChange}
                    error={errors.categoryId?.message}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    {...register('condition')}
                    className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select condition</option>
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
                    step="any"
                    {...register('startPrice')}
                    placeholder="0"
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
                    step="any"
                    {...register('minIncrement')}
                    placeholder={isSealed ? '0' : undefined}
                    readOnly={sealedField.readOnly}
                    disabled={sealedField.disabled}
                    className={cn('mt-1', sealedField.className)}
                  />
                  {isSealed ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Not used for sealed auctions (sent as 0).
                    </p>
                  ) : null}
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
              <AuctionBidRuleThreeColumnFields
                register={register}
                errors={errors}
                isSealed={isSealed}
                submitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl mb-6">
            <CardHeader>
              <CardTitle className="text-lg ">Media</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload images or video. First file will be the primary.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                multiple
                className="hidden"
                id="auction-media"
                onChange={handleAddFiles}
              />
              <label
                htmlFor="auction-media"
                className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Add images or video
                </span>
              </label>
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {assets.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted/30 shrink-0"
                  >
                    {item.assetType === 'IMAGE' ? (
                      <Image
                        src={item.previewUrl}
                        alt="Asset preview"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        playsInline
                      />
                    )}
                    {item.status === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                    {item.status === 'done' && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 text-red-600 text-xs p-1 text-center">
                        Error
                      </div>
                    )}
                    {item.status === 'idle' && (
                      <button
                        type="button"
                        onClick={() => uploadOne(index)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs hover:bg-black/50"
                      >
                        Upload
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAsset(index)}
                      className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg ">Submit draft</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review details and media, then create your draft auction.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Gavel className="h-4 w-4" />
                      Create draft
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/seller/dashboard">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
