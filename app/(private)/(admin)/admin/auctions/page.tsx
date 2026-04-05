'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getAdminAuctionsAction } from '@/actions/admin/auction.actions';
import { Button } from '@/components/ui/button';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import {
  SellerAuctionCard,
  SellerAuctionCardSkeleton,
} from '@/features/seller/auction/components/seller-auction-card';
import { AdminAuctionFilters } from '@/features/admin/auctions/components/auctions-view/admin-auction-filters';
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

const LIMIT_OPTIONS = [4, 5, 8, 10, 20];

const DEFAULT_FILTERS: IGetBrowseAuctionsFilter = {
  auctionType: 'ALL' as AuctionType | 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 8,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export default function AdminAuctionsPage() {
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

  useEffect(() => {
    getAuctionCategoriesForSellerAction()
      .then((res) => {
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminAuctionsAction(filters);
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
    <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-4 sm:px-6 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xl font-extrabold text-foreground">
            Auctions (admin)
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Showing all auction types except DRAFT.
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-lg"
        >
          <Link href="/admin/auctions/categories">Categories</Link>
        </Button>
      </header>

      <AdminAuctionFilters
        filters={filters}
        categories={categories}
        auctionTypeOptions={AUCTION_TYPE_OPTIONS}
        sortOptions={SORT_OPTIONS}
        limitOptions={LIMIT_OPTIONS}
        activeFilterCount={activeFilterCount}
        onUpdate={update}
        onReset={() => setFilters({ ...DEFAULT_FILTERS, page: 1 })}
      />

      <div className="mt-4">
        {loading ? (
          <div className="flex w-full flex-col gap-2">
            {Array.from({ length: Math.min(filters.limit, 8) }).map((_, i) => (
              <SellerAuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-center">
            <p className="text-xs font-medium text-destructive">{error}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Try again.</p>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {(response?.auctions ?? []).length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 px-4 py-10 text-center">
                <div className="text-sm font-medium text-foreground">
                  No auctions yet
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Try adjusting your filters.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="h-8 text-xs rounded-lg"
                    asChild
                  >
                    <Link href="/admin/auctions">Refresh</Link>
                  </Button>
                </div>
              </div>
            ) : (
              (response?.auctions ?? []).map((a) => (
                <SellerAuctionCard
                  key={a.id}
                  auction={a}
                  href={`/admin/auctions/${a.id}`}
                />
              ))
            )}
          </div>
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
