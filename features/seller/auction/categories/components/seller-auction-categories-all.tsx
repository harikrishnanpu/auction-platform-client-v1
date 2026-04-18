'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { AuctionCategory } from '@/types/auction.type';
import { SellerAuctionCategoriesTable } from './seller-auction-categories-table';

export function SellerAuctionCategoriesAll({
  categories,
  error,
}: {
  categories: AuctionCategory[];
  error?: string | null;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Verified categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No verified categories found.
          </p>
        ) : (
          <SellerAuctionCategoriesTable rows={categories} />
        )}
      </CardContent>
    </Card>
  );
}
