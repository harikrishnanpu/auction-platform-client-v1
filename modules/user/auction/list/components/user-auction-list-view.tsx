'use client';

import { Loader2 } from 'lucide-react';
import { useAuctionListFilters } from '../hooks/use-auction-list-filters';
import { useAuctionListData } from '../hooks/use-auction-list-data';
import { AuctionListFilters } from './auction-list-filters';
import { AuctionListGrid } from './auction-list-grid';

export function UserAuctionListView() {
  const {
    filters,
    setSearch,
    setCategory,
    setTypeFilter,
    queryFilters,
    categoryOptions,
    typeOptions,
  } = useAuctionListFilters();

  const { auctions, isLoading, isError, error } =
    useAuctionListData(queryFilters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">
          Browse Auctions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Active auctions. Place your bids and win.
        </p>
      </header>

      <AuctionListFilters
        search={filters.search}
        onSearchChange={setSearch}
        categoryFilter={filters.category}
        onCategoryChange={setCategory}
        typeFilter={filters.typeFilter}
        onTypeChange={setTypeFilter}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
      />

      {isError && (
        <div className="py-8 text-center text-destructive">
          <p>
            {error instanceof Error ? error.message : 'Failed to load auctions'}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="h-8 w-8 animate-spin text-muted-foreground"
            aria-hidden
          />
        </div>
      ) : (
        <AuctionListGrid
          auctions={auctions}
          searchQuery={filters.search}
          emptyMessage="No active auctions at the moment."
          emptyFilterMessage="No auctions match your filters."
        />
      )}
    </div>
  );
}
