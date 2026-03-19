'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { AuctionCategory } from '@/types/auction.type';
import { useSellerCategoryRequestForm } from '../hooks/use-seller-auction-categories';

export function SellerAuctionCategoryRequestForm({
  categories,
  error,
}: {
  categories: AuctionCategory[];
  error?: string | null;
}) {
  const {
    name,
    setName,
    parentId,
    setParentId,
    submitting,
    parentOptions,
    onSubmit,
  } = useSellerCategoryRequestForm(categories);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Request a new category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div>
          <Label htmlFor="catName">Category name</Label>
          <Input
            id="catName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Luxury Watches"
            className="mt-1"
            disabled={submitting}
          />
        </div>

        <div>
          <Label htmlFor="parent">Parent (optional)</Label>
          <select
            id="parent"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            disabled={submitting}
            className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <option value="">No parent (root)</option>
            {parentOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit request'}
          </Button>
          <Button variant="outline" asChild disabled={submitting}>
            <Link href="/seller/auction/create">Back to create auction</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
