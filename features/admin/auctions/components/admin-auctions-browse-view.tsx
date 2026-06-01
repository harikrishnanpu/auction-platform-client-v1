'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import {
  AuctionCard,
  AuctionCardSkeleton,
} from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
import { UserAuctionFilters } from '@/features/user/auctions/components/user-auction-filters';
import {
  ADMIN_AUCTIONS_DEFAULT_FILTERS,
  applyBrowseFilterUpdate,
  buildBrowseSearchParams,
  countAdminAuctionActiveFilters,
} from '@/lib/listing-search-params';
import type {
  AuctionCategory,
  IGetBrowseAuctionsFilter,
  IGetBrowseAuctionsResponse,
} from '@/types/auction.type';

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
  { label: 'Added', value: 'createdAt' },
] as const;

const LIMIT_OPTIONS = [4, 5, 8, 10, 20];

type AdminAuctionsBrowseViewProps = {
  filters: IGetBrowseAuctionsFilter;
  categories: AuctionCategory[];
  response: IGetBrowseAuctionsResponse | null;
  error: string | null;
};

export function AdminAuctionsBrowseView({
  filters,
  categories,
  response,
  error,
}: AdminAuctionsBrowseViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = response?.totalPages ?? 1;
  const currentPage = response?.currentPage ?? filters.page;
  const activeFilterCount = countAdminAuctionActiveFilters(filters);

  function navigate(next: IGetBrowseAuctionsFilter) {
    const query = buildBrowseSearchParams(next);
    startTransition(() => {
      router.push(query ? `/admin/auctions?${query}` : '/admin/auctions');
    });
  }

  function update<K extends keyof IGetBrowseAuctionsFilter>(
    key: K,
    value: IGetBrowseAuctionsFilter[K]
  ) {
    navigate(applyBrowseFilterUpdate(filters, key, value));
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

        <Link href="/admin/auctions/categories" className="inline-block">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg"
          >
            Categories
          </Button>
        </Link>
      </header>

      <UserAuctionFilters
        className="mt-4"
        filters={filters}
        categories={categories}
        auctionTypeOptions={[...AUCTION_TYPE_OPTIONS]}
        sortOptions={[...SORT_OPTIONS]}
        limitOptions={LIMIT_OPTIONS}
        activeFilterCount={activeFilterCount}
        onUpdate={update}
        onReset={() => navigate({ ...ADMIN_AUCTIONS_DEFAULT_FILTERS, page: 1 })}
        searchPlaceholder="Search title…"
      />

      <div className="mt-4">
        {isPending ? (
          <AuctionListingGrid variant="listing">
            {Array.from({ length: Math.min(filters.limit, 8) }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </AuctionListingGrid>
        ) : error ? (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-center">
            <p className="text-xs font-medium text-destructive">{error}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Try again.</p>
            <Button
              variant="outline"
              className="mt-3 h-8 text-xs rounded-lg"
              onClick={() => router.refresh()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <AuctionListingGrid variant="listing">
            {(response?.auctions ?? []).length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-10 text-center">
                <div className="text-sm font-medium text-foreground">
                  No auctions yet
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Try adjusting your filters.
                </div>
              </div>
            ) : (
              (response?.auctions ?? []).map((a) => (
                <AuctionCard
                  key={a.id}
                  auction={a}
                  href={`/admin/auctions/${a.id}`}
                />
              ))
            )}
          </AuctionListingGrid>
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
              update('page', Math.min(totalPages, filters.page + 1) as number)
            }
          />
        ) : null}
      </div>
    </div>
  );
}
