'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, Radio } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { appCard } from '@/lib/app-design';
import {
  applyBrowseFilterUpdate,
  BROWSE_DEFAULT_FILTERS,
  buildBrowseSearchParams,
  countBrowseActiveFilters,
} from '@/lib/listing-search-params';
import { cn } from '@/lib/utils';
import { SellerAuctionsPagination } from '@/features/seller/auction/components/seller-auctions-pagination';
import {
  UserAuctionsCards,
  UserAuctionsCardsSkeleton,
} from '@/features/user/auctions/components/user-auctions-cards';
import { UserAuctionFilters } from '@/features/user/auctions/components/user-auction-filters';
import type {
  AuctionCategory,
  IGetBrowseAuctionsFilter,
  IGetBrowseAuctionsResponse,
} from '@/types/auction.type';

const AUCTION_TYPE_OPTIONS = [
  { label: 'All types', value: 'ALL' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Long', value: 'LONG' },
  { label: 'Sealed', value: 'SEALED' },
] as const;

const SORT_OPTIONS = [
  { label: 'Starts', value: 'startAt' },
  { label: 'Ends', value: 'endAt' },
  { label: 'Price', value: 'startPrice' },
  { label: 'Added', value: 'createdAt' },
] as const;

const LIMIT_OPTIONS = [12, 16, 24, 32];

type AuctionsBrowseViewProps = {
  filters: IGetBrowseAuctionsFilter;
  categories: AuctionCategory[];
  response: IGetBrowseAuctionsResponse | null;
  error: string | null;
};

export function AuctionsBrowseView({
  filters,
  categories,
  response,
  error,
}: AuctionsBrowseViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = response?.totalPages ?? 1;
  const currentPage = response?.currentPage ?? filters.page;
  const totalListings = response?.total ?? 0;
  const activeFilterCount = countBrowseActiveFilters(filters);

  function navigate(next: IGetBrowseAuctionsFilter) {
    const query = buildBrowseSearchParams(next);
    if (pathname === '/auctions' && searchParams.toString() === query) return;

    startTransition(() => {
      router.push(query ? `/auctions?${query}` : '/auctions');
    });
  }

  function update<K extends keyof IGetBrowseAuctionsFilter>(
    key: K,
    value: IGetBrowseAuctionsFilter[K]
  ) {
    navigate(applyBrowseFilterUpdate(filters, key, value));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(appCard(), 'inline-flex items-center gap-2 px-4 py-2')}
        >
          <LayoutGrid className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            {isPending ? '…' : totalListings}
          </span>
          <span className="text-muted-foreground">
            {totalListings === 1 ? 'listing' : 'listings'}
          </span>
        </div>
        {String(filters.auctionType) === 'LIVE' ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-icon)] px-3 py-1.5 text-xs font-semibold text-primary">
            <Radio className="size-3.5" />
            Live now
          </div>
        ) : null}
      </div>

      <div className={appCard()}>
        <UserAuctionFilters
          filters={filters}
          categories={categories}
          auctionTypeOptions={[...AUCTION_TYPE_OPTIONS]}
          sortOptions={[...SORT_OPTIONS]}
          limitOptions={LIMIT_OPTIONS}
          activeFilterCount={activeFilterCount}
          onUpdate={update}
          onReset={() => navigate({ ...BROWSE_DEFAULT_FILTERS, page: 1 })}
          searchPlaceholder="Search auctions…"
          className="border-0 pb-0"
        />
      </div>

      <div className="min-h-[200px]">
        {isPending ? (
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
              onClick={() => router.refresh()}
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
                onClick={() => navigate({ ...BROWSE_DEFAULT_FILTERS, page: 1 })}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>

      {!isPending && !error ? (
        <div className="mt-6 flex justify-end">
          <SellerAuctionsPagination
            variant="minimal-end"
            hidePageLabel
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            loading={isPending}
            onPrev={() =>
              update('page', Math.max(1, filters.page - 1) as number)
            }
            onNext={() =>
              update(
                'page',
                Math.min(Math.max(1, totalPages), filters.page + 1) as number
              )
            }
          />
        </div>
      ) : null}
    </div>
  );
}
