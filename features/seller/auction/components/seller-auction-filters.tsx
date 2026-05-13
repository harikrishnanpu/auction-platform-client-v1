'use client';

import { Funnel, RotateCcw } from 'lucide-react';

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
    <Card className="mt-6 rounded-xl border border-border bg-muted/20 shadow-none">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <Funnel className="size-4 text-muted-foreground" aria-hidden />
              Manage auction filters
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filters apply immediately to your seller auction list below.
            </p>
          </div>
          {activeFilterCount > 0 ? (
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-medium"
            >
              {activeFilterCount} active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-full text-xs font-normal"
            >
              Default
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-3">
            <SearchInput
              placeholder="Search title or description…"
              value={filters.search}
              onChange={(v) => onUpdate('search', v)}
              debounceMs={500}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={String(filters.status)}
              onValueChange={(v) =>
                onUpdate('status', v as IGetAllSellerAuctionsFilter['status'])
              }
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
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
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
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
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
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
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Category
            </label>
            <Select
              value={filters.categoryId}
              onValueChange={(v) => onUpdate('categoryId', v)}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
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
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Sort by
            </label>
            <Select
              value={filters.sort}
              onValueChange={(v) => onUpdate('sort', v)}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
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
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Order
            </label>
            <Select
              value={filters.order}
              onValueChange={(v) =>
                onUpdate('order', v as IGetAllSellerAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Per page
            </label>
            <Select
              value={String(filters.limit)}
              onValueChange={(v) => onUpdate('limit', Number(v))}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background text-sm">
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            Totals and pagination reflect the filters above.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            type="button"
            onClick={onReset}
          >
            <RotateCcw className="size-3.5" />
            Reset filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
