'use client';

import { SlidersHorizontal } from 'lucide-react';

import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';

import { MyAuctionsFilters } from './my-auctions-filters';
import {
  UserAuctionsCards,
  UserAuctionsCardsSkeleton,
} from './user-auctions-cards';
import { useUserParticipatedAuctions } from '../hooks/use-user-participated-auctions';

export function ProfileMyAuctionsView() {
  const {
    filters,
    data,
    loading,
    error,
    updateFilter,
    resetFilters,
    activeFilterCount,
  } = useUserParticipatedAuctions();

  const total = data?.total ?? 0;

  return (
    <ProfilePageShell className="lg:max-w-5xl">
      <ProfilePageCard title="Find auctions" icon={SlidersHorizontal}>
        <MyAuctionsFilters
          filters={filters}
          activeFilterCount={activeFilterCount}
          onPatch={updateFilter}
          onReset={resetFilters}
        />
      </ProfilePageCard>

      {!loading && !error && data ? (
        <p className="px-0.5 text-[13px] text-muted-foreground">
          {total === 0
            ? 'No auctions match your filters.'
            : `${total} auction${total === 1 ? '' : 's'} found`}
        </p>
      ) : null}

      {loading ? (
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
