'use client';

import { RotateCcw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  AuctionCategory,
  IGetAllSellerAuctionsFilter,
} from '@/types/auction.type';

interface FilterOption {
  label: string;
  value: string;
}

interface SellerAuctionFiltersProps {
  filters: IGetAllSellerAuctionsFilter;
  categories: AuctionCategory[];
  statusOptions: FilterOption[];
  auctionTypeOptions: FilterOption[];
  sortOptions: FilterOption[];
  limitOptions: number[];
  activeFilterCount: number;
  onUpdate: <K extends keyof IGetAllSellerAuctionsFilter>(
    key: K,
    value: IGetAllSellerAuctionsFilter[K]
  ) => void;
  onReset: () => void;
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
}: SellerAuctionFiltersProps) {
  return (
    <Card className="mt-4 rounded-lg border-border/70 bg-card/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="text-base">Filters</CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Search, refine, and paginate your auctions.
            </p>
          </div>
          {activeFilterCount > 0 ? (
            <Badge variant="secondary" className="bg-muted text-[11px]">
              {activeFilterCount} active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[11px]">
              Default
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-3">
            <SearchInput
              placeholder="Search title..."
              value={filters.search}
              onChange={(v) => onUpdate('search', v)}
              debounceMs={500}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Status
            </label>
            <Select
              value={String(filters.status)}
              onValueChange={(v) =>
                onUpdate('status', v as IGetAllSellerAuctionsFilter['status'])
              }
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Auction type
            </label>
            <Select
              value={String(filters.auctionType)}
              onValueChange={(v) =>
                onUpdate(
                  'auctionType',
                  v as IGetAllSellerAuctionsFilter['auctionType']
                )
              }
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {auctionTypeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Category
            </label>
            <Select
              value={filters.categoryId}
              onValueChange={(v) => onUpdate('categoryId', v)}
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Sort
            </label>
            <Select
              value={filters.sort}
              onValueChange={(v) => onUpdate('sort', v)}
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Order
            </label>
            <Select
              value={filters.order}
              onValueChange={(v) =>
                onUpdate('order', v as IGetAllSellerAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-muted-foreground">
              Items per page
            </label>
            <Select
              value={String(filters.limit)}
              onValueChange={(v) => onUpdate('limit', Number(v))}
            >
              <SelectTrigger className="h-9 rounded-lg text-sm">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            Showing results for current filters.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onReset}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
