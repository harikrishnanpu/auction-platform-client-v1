'use client';

import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Radio } from 'lucide-react';

import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  { label: 'Live', value: 'LIVE' },
  { label: 'Long', value: 'LONG' },
  { label: 'Sealed', value: 'SEALED' },
];

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Starts', value: 'startAt' },
  { label: 'Ends', value: 'endAt' },
  { label: 'Price', value: 'startPrice' },
  { label: 'Added', value: 'createdAt' },
];

const LIMIT_OPTIONS = [12, 16, 24, 32];

const DEFAULT_FILTERS: IGetBrowseAuctionsFilter = {
  auctionType: 'ALL' as AuctionType | 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 12,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

function ListingCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuctionsBrowseView() {
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
      .catch(() => setCategories([]));
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm">
          <LayoutGrid className="size-4 text-brand-600" />
          <span className="font-medium text-foreground">
            {loading ? '…' : totalListings}
          </span>
          <span className="text-muted-foreground">
            {totalListings === 1 ? 'listing' : 'listings'}
          </span>
        </div>
        {String(filters.auctionType) === 'LIVE' ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <Radio className="size-3.5" />
            Live now
          </div>
        ) : null}
      </div>

      <ListingCard>
        <UserAuctionFilters
          filters={filters}
          categories={categories}
          auctionTypeOptions={AUCTION_TYPE_OPTIONS}
          sortOptions={SORT_OPTIONS}
          limitOptions={LIMIT_OPTIONS}
          activeFilterCount={activeFilterCount}
          onUpdate={update}
          onReset={() => setFilters({ ...DEFAULT_FILTERS, page: 1 })}
          searchPlaceholder="Search auctions…"
          className="border-0 pb-0"
        />
      </ListingCard>

      <div className="min-h-[200px]">
        {loading ? (
          <UserAuctionsCardsSkeleton count={Math.min(filters.limit, 12)} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try different filters or refresh the page.
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => setFilters((p) => ({ ...p }))}
            >
              Retry
            </Button>
          </div>
        ) : (
          <UserAuctionsCards
            auctions={response?.auctions ?? []}
            limit={filters.limit}
            sortMode="none"
            emptyAction={
              <Button
                variant="outline"
                className="mt-2 rounded-full"
                onClick={() => setFilters({ ...DEFAULT_FILTERS, page: 1 })}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>

      {!loading && !error ? (
        <div className="mt-6 flex justify-end">
          <SellerAuctionsPagination
            variant="minimal-end"
            hidePageLabel
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            loading={loading}
            onPrev={() =>
              setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
            }
            onNext={() =>
              setFilters((p) => ({
                ...p,
                page: Math.min(Math.max(1, totalPages), p.page + 1),
              }))
            }
          />
        </div>
      ) : null}
    </div>
  );
}
