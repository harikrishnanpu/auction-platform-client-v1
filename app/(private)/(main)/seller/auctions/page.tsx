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
} from '@/modules/seller/auction/components/seller-auctions-cards';
import { SellerAuctionFilters } from '@/modules/seller/auction/components/seller-auction-filters';
import { SellerAuctionsPagination } from '@/modules/seller/auction/components/seller-auctions-pagination';
import { SellerListingSectionSkeleton } from '@/modules/seller/components/seller-shell-skeleton';
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
  { label: 'Published', value: 'PUBLISHED' },
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
  { label: 'Start time', value: 'startAt' },
  { label: 'End time', value: 'endAt' },
  { label: 'Start price', value: 'startPrice' },
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
    <div className="mx-auto max-w-5xl px-3 py-4">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            All auctions
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Search, filter by status/type/category, then paginate.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
            <Link href="/seller/auction/categories">
              <Layers className="size-3.5" />
              Categories
            </Link>
          </Button>
          <Button asChild size="sm" className="h-8 text-xs">
            <Link href="/seller/auction/create">
              <Plus className="size-3.5" />
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
        <Card className="mt-4 rounded-lg border-border/70 bg-muted/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Verify to continue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              Complete seller verification to view your auctions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <SellerAuctionFilters
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
          <div className="mt-4">
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
