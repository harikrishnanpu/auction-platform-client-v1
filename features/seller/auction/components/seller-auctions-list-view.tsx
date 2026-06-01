'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Layers, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SellerAuctionsCards,
  SellerAuctionsCardsSkeleton,
} from '@/features/seller/auction/components/seller-auctions-cards';
import { SellerAuctionFilters } from '@/features/seller/auction/components/seller-auction-filters';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import { SellerListingSectionSkeleton } from '@/features/seller/components/seller-shell-skeleton';
import {
  applySellerAuctionFilterUpdate,
  buildSellerAuctionSearchParams,
  countSellerAuctionActiveFilters,
  SELLER_AUCTIONS_DEFAULT_FILTERS,
} from '@/lib/listing-search-params';
import type {
  AuctionCategory,
  IGetAllSellerAuctionsFilter,
  IGetAllSellerAuctionsResponse,
} from '@/types/auction.type';
import { KycStatusEnum } from '@/types/kyc.type';
import useKycStore from '@/store/kyc.store';

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Live listings', value: 'PUBLISHED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Ended', value: 'ENDED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Cancelled', value: 'CANCELLED' },
] as const;

const AUCTION_TYPE_OPTIONS = [
  { label: 'All types', value: 'ALL' },
  { label: 'Long', value: 'LONG' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Sealed', value: 'SEALED' },
] as const;

const SORT_OPTIONS = [
  { label: 'Starts', value: 'startAt' },
  { label: 'Ends', value: 'endAt' },
  { label: 'Price', value: 'startPrice' },
] as const;

const LIMIT_OPTIONS = [4, 5, 8, 10, 20];

type SellerAuctionsListViewProps = {
  filters: IGetAllSellerAuctionsFilter;
  categories: AuctionCategory[];
  response: IGetAllSellerAuctionsResponse | null;
  error: string | null;
};

export function SellerAuctionsListView({
  filters,
  categories,
  response,
  error,
}: SellerAuctionsListViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = kycStatus as KycStatusEnum | null;

  const totalPages = response?.totalPages ?? 1;
  const currentPage = response?.currentPage ?? filters.page;
  const activeFilterCount = countSellerAuctionActiveFilters(filters);

  function navigate(next: IGetAllSellerAuctionsFilter) {
    const query = buildSellerAuctionSearchParams(next);
    startTransition(() => {
      router.push(query ? `/seller/auctions?${query}` : '/seller/auctions');
    });
  }

  function update<K extends keyof IGetAllSellerAuctionsFilter>(
    key: K,
    value: IGetAllSellerAuctionsFilter[K]
  ) {
    navigate(applySellerAuctionFilterUpdate(filters, key, value));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            All auctions
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Search and filter your listings, then open one to edit or review.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/seller/auction/categories" className="inline-block">
            <Button variant="outline" size="sm" className="h-9 rounded-lg">
              <Layers className="size-4" />
              Categories
            </Button>
          </Link>
          <Link href="/seller/auction/create" className="inline-block">
            <Button size="sm" className="h-9 rounded-lg">
              <Plus className="size-4" />
              New auction
            </Button>
          </Link>
        </div>
      </header>

      {kycStatusEnum === null ? (
        <div className="mt-4">
          <SellerListingSectionSkeleton />
        </div>
      ) : kycStatusEnum !== KycStatusEnum.APPROVED ? (
        <Card className="mt-6 rounded-xl border-border bg-muted/25 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Verify to continue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Complete seller verification to view your auctions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <SellerAuctionFilters
            className="mt-4"
            filters={filters}
            categories={categories}
            statusOptions={[...STATUS_OPTIONS]}
            auctionTypeOptions={[...AUCTION_TYPE_OPTIONS]}
            sortOptions={[...SORT_OPTIONS]}
            limitOptions={LIMIT_OPTIONS}
            activeFilterCount={activeFilterCount}
            onUpdate={update}
            onReset={() =>
              navigate({ ...SELLER_AUCTIONS_DEFAULT_FILTERS, page: 1 })
            }
          />

          <div className="mt-6">
            {isPending ? (
              <SellerAuctionsCardsSkeleton count={Math.min(filters.limit, 8)} />
            ) : error ? (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-center">
                <p className="text-xs font-medium text-destructive">{error}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Try again.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 h-8 text-xs rounded-lg"
                  onClick={() => router.refresh()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <SellerAuctionsCards
                auctions={response?.auctions ?? []}
                sortMode="none"
                emptyAction={
                  <Link
                    href="/seller/auction/create"
                    className="inline-block mt-2"
                  >
                    <Button
                      variant="outline"
                      className="h-8 text-xs rounded-lg"
                    >
                      Create auction
                    </Button>
                  </Link>
                }
              />
            )}

            {!isPending && !error ? (
              <SellerAuctionsPagination
                className="mt-3"
                currentPage={currentPage}
                totalPages={totalPages}
                loading={isPending}
                onPrev={() =>
                  update('page', Math.max(1, filters.page - 1) as number)
                }
                onNext={() =>
                  update(
                    'page',
                    Math.min(totalPages, filters.page + 1) as number
                  )
                }
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
