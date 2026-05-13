'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import { Button } from '@/components/ui/button';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import {
  UserAuctionsCards,
  UserAuctionsCardsSkeleton,
} from '@/features/user/auctions/components/user-auctions-cards';
import { UserAuctionFilters } from '@/features/user/auctions/components/user-auction-filters';
import type {
  AuctionCategory,
  AuctionType,
  IGetBrowseAuctionsFilter,
  IGetBrowseAuctionsResponse,
} from '@/types/auction.type';

const AUCTION_TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All types', value: 'ALL' },
  { label: 'Long', value: 'LONG' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Sealed', value: 'SEALED' },
];

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Start time', value: 'startAt' },
  { label: 'End time', value: 'endAt' },
  { label: 'Start price', value: 'startPrice' },
  { label: 'Created', value: 'createdAt' },
];

const LIMIT_OPTIONS = [8, 12, 16, 24];

const DEFAULT_FILTERS: IGetBrowseAuctionsFilter = {
  auctionType: 'ALL' as AuctionType | 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 12,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export default function AuctionsPage() {
  const [categories, setCategories] = useState<AuctionCategory[]>([]);
  const [filters, setFilters] =
    useState<IGetBrowseAuctionsFilter>(DEFAULT_FILTERS);
  const [response, setResponse] = useState<IGetBrowseAuctionsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = response?.totalPages ?? 1;
  const currentPage = response?.currentPage ?? filters.page;
  const totalListings = response?.total ?? 0;

  useEffect(() => {
    getAuctionCategoriesForSellerAction()
      .then((res) => {
        if (res.success && res.data?.categories)
          setCategories(res.data.categories);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await getBrowseAuctionsAction(filters);
        if (cancelled) return;
        if (res.success && res.data) setResponse(res.data);
        else {
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
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
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

  function update<K extends keyof IGetBrowseAuctionsFilter>(
    key: K,
    value: IGetBrowseAuctionsFilter[K]
  ) {
    setFilters((prev) => {
      const shouldResetPage =
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
    <div className="mx-auto w-full max-w-[min(100%,1440px)] px-4 py-6 sm:px-6 lg:px-10 sm:py-8">
      <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Browse
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl sm:leading-tight">
            Auctions
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Active listings only. Use filters to narrow results.
          </p>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-9 shrink-0 rounded-lg"
        >
          <Link href="/home">Back to home</Link>
        </Button>
      </header>

      <UserAuctionFilters
        filters={filters}
        categories={categories}
        auctionTypeOptions={AUCTION_TYPE_OPTIONS}
        sortOptions={SORT_OPTIONS}
        limitOptions={LIMIT_OPTIONS}
        activeFilterCount={activeFilterCount}
        onUpdate={update}
        onReset={() => setFilters({ ...DEFAULT_FILTERS, page: 1 })}
      />

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Results</h2>
          <p className="text-[11px] text-muted-foreground">
            {loading
              ? 'Loading…'
              : `${totalListings} listing${totalListings === 1 ? '' : 's'}`}
          </p>
        </div>

        {loading ? (
          <UserAuctionsCardsSkeleton count={Math.min(filters.limit, 12)} />
        ) : error ? (
          <div className="rounded-[12px] border border-destructive/25 bg-destructive/5 p-4 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting filters or refresh.
            </p>
          </div>
        ) : (
          <UserAuctionsCards
            auctions={response?.auctions ?? []}
            limit={filters.limit}
            sortMode="none"
            emptyAction={
              <Button
                variant="outline"
                className="mt-2 h-9 rounded-[8px] text-xs"
                asChild
              >
                <Link href="/auctions">Refresh</Link>
              </Button>
            }
          />
        )}

        <SellerAuctionsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPrev={() =>
            setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
          }
          onNext={() =>
            setFilters((p) => ({
              ...p,
              page: Math.min(totalPages, p.page + 1),
            }))
          }
        />
      </div>
    </div>
  );
}
