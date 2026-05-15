'use client';

import {
  AuctionListingFilters,
  type AuctionFilterOption,
  type AuctionListingFiltersPatch,
} from '@/features/auction/components/auction-listing-filters';
import type {
  AuctionCategory,
  IGetAllSellerAuctionsFilter,
} from '@/types/auction.type';

export type { AuctionFilterOption };

interface SellerAuctionFiltersProps {
  filters: IGetAllSellerAuctionsFilter;
  categories: AuctionCategory[];
  statusOptions: AuctionFilterOption[];
  auctionTypeOptions: AuctionFilterOption[];
  sortOptions: AuctionFilterOption[];
  limitOptions: number[];
  activeFilterCount: number;
  onUpdate: <K extends keyof IGetAllSellerAuctionsFilter>(
    key: K,
    value: IGetAllSellerAuctionsFilter[K]
  ) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  className?: string;
}

function applySellerPatch(
  patch: AuctionListingFiltersPatch,
  onUpdate: SellerAuctionFiltersProps['onUpdate']
) {
  if (patch.search !== undefined) onUpdate('search', patch.search);
  if (patch.categoryId !== undefined) onUpdate('categoryId', patch.categoryId);
  if (patch.auctionType !== undefined) {
    onUpdate(
      'auctionType',
      patch.auctionType as IGetAllSellerAuctionsFilter['auctionType']
    );
  }
  if (patch.sort !== undefined) onUpdate('sort', patch.sort);
  if (patch.order !== undefined) onUpdate('order', patch.order);
  if (patch.limit !== undefined) onUpdate('limit', patch.limit);
  if (patch.status !== undefined) {
    onUpdate('status', patch.status as IGetAllSellerAuctionsFilter['status']);
  }
}

export function SellerAuctionFilters({
  filters,
  categories,
  statusOptions,
  auctionTypeOptions,
  sortOptions,
  limitOptions,
  activeFilterCount,
  onUpdate,
  onReset,
  searchPlaceholder = 'Search title or description…',
  className,
}: SellerAuctionFiltersProps) {
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
        status: String(filters.status),
      }}
      categories={categories}
      statusOptions={statusOptions}
      auctionTypeOptions={auctionTypeOptions}
      sortOptions={sortOptions}
      limitOptions={limitOptions}
      activeFilterCount={activeFilterCount}
      onPatch={(p) => applySellerPatch(p, onUpdate)}
      onReset={onReset}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
