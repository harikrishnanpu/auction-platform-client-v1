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
  { label: 'Starts', value: 'startAt' },
  { label: 'Ends', value: 'endAt' },
  { label: 'Price', value: 'startPrice' },
  { label: 'Added', value: 'createdAt' },
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
    <div className="mx-auto w-full max-w-[min(100%,1600px)] px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-10 lg:pb-10">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Browse auctions
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Active listings
            {!loading && (
              <>
                {' · '}
                <span className="tabular-nums text-foreground/90">
                  {totalListings}
                </span>{' '}
                {totalListings === 1 ? 'result' : 'results'}
              </>
            )}
            {loading ? ' · …' : null}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 shrink-0 self-start rounded-md text-xs sm:self-auto"
        >
          <Link href="/home">Home</Link>
        </Button>
      </div>

      <div className="mt-4">
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
      </div>

      <div className="mt-4">
        {loading ? (
          <UserAuctionsCardsSkeleton count={Math.min(filters.limit, 12)} />
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try different filters or refresh.
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
                className="mt-2 h-8 rounded-md text-xs"
                asChild
              >
                <Link href="/auctions">Refresh</Link>
              </Button>
            }
          />
        )}

        <div className="mt-4">
          <SellerAuctionsPagination
            variant="minimal-end"
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
    </div>
  );
}
