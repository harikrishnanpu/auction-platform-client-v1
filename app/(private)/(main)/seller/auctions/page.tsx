'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layers, Plus } from 'lucide-react';

import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SellerAuctionsCards,
  SellerAuctionsCardsSkeleton,
} from '@/features/seller/auction/components/seller-auctions-cards';
import { SellerAuctionFilters } from '@/features/seller/auction/components/seller-auction-filters';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import { SellerListingSectionSkeleton } from '@/features/seller/components/seller-shell-skeleton';
import type {
  AuctionStatus,
  AuctionType,
  IGetAllSellerAuctionsFilter,
  IGetAllSellerAuctionsResponse,
} from '@/types/auction.type';
import type { AuctionCategory } from '@/types/auction.type';
import { KycStatusEnum } from '@/types/kyc.type';
import useKycStore from '@/store/kyc.store';

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Live listings', value: 'PUBLISHED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Ended', value: 'ENDED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const AUCTION_TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All types', value: 'ALL' },
  { label: 'Long', value: 'LONG' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Sealed', value: 'SEALED' },
];

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Starts', value: 'startAt' },
  { label: 'Ends', value: 'endAt' },
  { label: 'Price', value: 'startPrice' },
];

const LIMIT_OPTIONS = [4, 5, 8, 10, 20];

const DEFAULT_FILTERS: IGetAllSellerAuctionsFilter = {
  status: 'ALL' as AuctionStatus,
  auctionType: 'ALL' as AuctionType,
  categoryId: 'ALL',
  page: 1,
  limit: 8,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export default function SellerAuctionsPage() {
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = kycStatus as KycStatusEnum | null;

  const [categories, setCategories] = useState<AuctionCategory[]>([]);
  const [filters, setFilters] =
    useState<IGetAllSellerAuctionsFilter>(DEFAULT_FILTERS);
  const [response, setResponse] =
    useState<IGetAllSellerAuctionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = response?.totalPages ?? 1;
  const currentPage = response?.currentPage ?? filters.page;

  useEffect(() => {
    // load categories for category filter
    getAuctionCategoriesForSellerAction()
      .then((res) => {
        if (res.success && res.data?.categories)
          setCategories(res.data.categories);
      })
      .catch(() => {
        // category filter can still work with just "All"
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setResponse(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await getSellerAuctionsAction(filters);
        if (cancelled) return;
        if (res.success && res.data) {
          setResponse(res.data);
        } else {
          setResponse(null);
          setError(res.error ?? 'Failed to load auctions');
        }
      } catch (e: unknown) {
        if (cancelled) return;
        setResponse(null);
        setError(e instanceof Error ? e.message : 'Failed to load auctions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [filters, kycStatusEnum]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (String(filters.status) !== 'ALL') count += 1;
    if (String(filters.auctionType) !== 'ALL') count += 1;
    if (filters.categoryId !== 'ALL') count += 1;
    if (filters.search.trim()) count += 1;
    if (
      filters.sort !== DEFAULT_FILTERS.sort ||
      filters.order !== DEFAULT_FILTERS.order
    )
      count += 1;
    if (filters.limit !== DEFAULT_FILTERS.limit) count += 1;
    return count;
  }, [filters]);

  function update<K extends keyof IGetAllSellerAuctionsFilter>(
    key: K,
    value: IGetAllSellerAuctionsFilter[K]
  ) {
    setFilters((prev) => {
      const shouldResetPage =
        key === 'status' ||
        key === 'auctionType' ||
        key === 'categoryId' ||
        key === 'search' ||
        key === 'sort' ||
        key === 'order' ||
        key === 'limit';

      return {
        ...prev,
        [key]: value,
        ...(shouldResetPage ? { page: 1 } : {}),
      };
    });
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
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-lg"
          >
            <Link href="/seller/auction/categories">
              <Layers className="size-4" />
              Categories
            </Link>
          </Button>
          <Button asChild size="sm" className="h-9 rounded-lg">
            <Link href="/seller/auction/create">
              <Plus className="size-4" />
              New auction
            </Link>
          </Button>
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
            statusOptions={STATUS_OPTIONS}
            auctionTypeOptions={AUCTION_TYPE_OPTIONS}
            sortOptions={SORT_OPTIONS}
            limitOptions={LIMIT_OPTIONS}
            activeFilterCount={activeFilterCount}
            onUpdate={update}
            onReset={() => setFilters({ ...DEFAULT_FILTERS, page: 1 })}
          />

          {/* List + pagination */}
          <div className="mt-6">
            {loading ? (
              <SellerAuctionsCardsSkeleton count={Math.min(filters.limit, 8)} />
            ) : error ? (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-center">
                <p className="text-xs font-medium text-destructive">{error}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Try again.
                </p>
              </div>
            ) : (
              <SellerAuctionsCards
                auctions={response?.auctions ?? []}
                sortMode="none"
                emptyAction={
                  <Button
                    asChild
                    variant="outline"
                    className="h-8 text-xs rounded-lg mt-2"
                  >
                    <Link href="/seller/auction/create">Create auction</Link>
                  </Button>
                }
              />
            )}

            <SellerAuctionsPagination
              className="mt-3"
              currentPage={currentPage}
              totalPages={totalPages}
              loading={loading}
              onPrev={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              onNext={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
