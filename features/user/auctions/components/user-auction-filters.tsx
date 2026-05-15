'use client';

import {
  AuctionListingFilters,
  type AuctionFilterOption,
  type AuctionListingFiltersPatch,
} from '@/features/auction/components/auction-listing-filters';
import type {
  AuctionCategory,
  IGetBrowseAuctionsFilter,
} from '@/types/auction.type';

export type { AuctionFilterOption };

interface UserAuctionFiltersProps {
  filters: IGetBrowseAuctionsFilter;
  categories: AuctionCategory[];
  auctionTypeOptions: AuctionFilterOption[];
  sortOptions: AuctionFilterOption[];
  limitOptions: number[];
  activeFilterCount: number;
  onUpdate: <K extends keyof IGetBrowseAuctionsFilter>(
    key: K,
    value: IGetBrowseAuctionsFilter[K]
  ) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  className?: string;
}

function applyBrowsePatch(
  patch: AuctionListingFiltersPatch,
  onUpdate: UserAuctionFiltersProps['onUpdate']
) {
  if (patch.search !== undefined) onUpdate('search', patch.search);
  if (patch.categoryId !== undefined) onUpdate('categoryId', patch.categoryId);
  if (patch.auctionType !== undefined) {
    onUpdate(
      'auctionType',
      patch.auctionType as IGetBrowseAuctionsFilter['auctionType']
    );
  }
  if (patch.sort !== undefined) onUpdate('sort', patch.sort);
  if (patch.order !== undefined) onUpdate('order', patch.order);
  if (patch.limit !== undefined) onUpdate('limit', patch.limit);
}

export function UserAuctionFilters({
  filters,
  categories,
  auctionTypeOptions,
  sortOptions,
  limitOptions,
  activeFilterCount,
  onUpdate,
  onReset,
  searchPlaceholder,
  className,
}: UserAuctionFiltersProps) {
  return (
    <AuctionListingFilters
      className={className}
      values={{
        search: filters.search,
        categoryId: filters.categoryId,
        auctionType: String(filters.auctionType),
        sort: filters.sort,
        order: filters.order,
        limit: filters.limit,
      }}
      categories={categories}
      auctionTypeOptions={auctionTypeOptions}
      sortOptions={sortOptions}
      limitOptions={limitOptions}
      activeFilterCount={activeFilterCount}
      onPatch={(p) => applyBrowsePatch(p, onUpdate)}
      onReset={onReset}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
