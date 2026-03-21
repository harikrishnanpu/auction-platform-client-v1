'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { AuctionCategory } from '@/types/auction.type';
import { useSellerMyCategoryRequests } from '../hooks/use-seller-auction-categories';
import { SellerAuctionCategoriesTable } from './seller-auction-categories-table';

export function SellerAuctionMyCategoryRequests({
  requests,
  error,
}: {
  requests: AuctionCategory[];
  error?: string | null;
}) {
  const { requests: normalized } = useSellerMyCategoryRequests(requests);

  const rows = useMemo(() => normalized, [normalized]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Your category requests</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Track status and resubmit if rejected.
        </p>
      </CardHeader>

      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No category requests found.
          </p>
        ) : (
          <SellerAuctionCategoriesTable rows={rows} showRejectedReason />
        )}
      </CardContent>
    </Card>
  );
}
