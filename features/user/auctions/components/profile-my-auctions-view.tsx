'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';
import {
  applyMyAuctionsFilterUpdate,
  buildMyAuctionsSearchParams,
  MY_AUCTIONS_DEFAULT_FILTERS,
} from '@/lib/listing-search-params';
import type {
  IGetMyAuctionsFilter,
  IGetMyAuctionsResponse,
} from '@/types/auction.type';

import { MyAuctionsFilters } from './my-auctions-filters';
import {
  UserAuctionsCards,
  UserAuctionsCardsSkeleton,
} from './user-auctions-cards';

type ProfileMyAuctionsViewProps = {
  filters: IGetMyAuctionsFilter;
  data: IGetMyAuctionsResponse | null;
  error: string | null;
  activeFilterCount: number;
};

export function ProfileMyAuctionsView({
  filters,
  data,
  error,
  activeFilterCount,
}: ProfileMyAuctionsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const total = data?.total ?? 0;

  function navigate(next: IGetMyAuctionsFilter) {
    const query = buildMyAuctionsSearchParams(next);
    if (
      pathname === '/profile/my-auctions' &&
      searchParams.toString() === query
    ) {
      return;
    }

    startTransition(() => {
      router.push(
        query ? `/profile/my-auctions?${query}` : '/profile/my-auctions'
      );
    });
  }

  function updateFilter<K extends keyof IGetMyAuctionsFilter>(
    key: K,
    value: IGetMyAuctionsFilter[K]
  ) {
    navigate(applyMyAuctionsFilterUpdate(filters, key, value));
  }

  return (
    <ProfilePageShell className="lg:max-w-5xl">
      <ProfilePageCard title="Find auctions" icon={SlidersHorizontal}>
        <MyAuctionsFilters
          filters={filters}
          activeFilterCount={activeFilterCount}
          onPatch={(key, value) => updateFilter(key, value)}
          onReset={() => navigate(MY_AUCTIONS_DEFAULT_FILTERS)}
        />
      </ProfilePageCard>

      {!isPending && !error && data ? (
        <p className="px-0.5 text-[13px] text-muted-foreground">
          {total === 0
            ? 'No auctions match your filters.'
            : `${total} auction${total === 1 ? '' : 's'} found`}
        </p>
      ) : null}

      {isPending ? (
        <UserAuctionsCardsSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive">
          {error}
        </div>
      ) : (
        <>
          <UserAuctionsCards auctions={data?.auctions ?? []} sortMode="none" />
          <PaginationControls
            page={data?.currentPage ?? filters.page}
            totalPages={data?.totalPages ?? 1}
            onPrev={() => updateFilter('page', Math.max(1, filters.page - 1))}
            onNext={() =>
              updateFilter(
                'page',
                Math.min(data?.totalPages ?? 1, filters.page + 1)
              )
            }
          />
        </>
      )}
    </ProfilePageShell>
  );
}
