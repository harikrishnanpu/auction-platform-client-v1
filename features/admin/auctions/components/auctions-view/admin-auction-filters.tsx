'use client';

import { Funnel, RotateCcw, Sparkles } from 'lucide-react';

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
  IGetBrowseAuctionsFilter,
} from '@/types/auction.type';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminAuctionFiltersProps {
  filters: IGetBrowseAuctionsFilter;
  categories: AuctionCategory[];
  auctionTypeOptions: FilterOption[];
  sortOptions: FilterOption[];
  limitOptions: number[];
  activeFilterCount: number;
  onUpdate: <K extends keyof IGetBrowseAuctionsFilter>(
    key: K,
    value: IGetBrowseAuctionsFilter[K]
  ) => void;
  onReset: () => void;
}

export function AdminAuctionFilters({
  filters,
  categories,
  auctionTypeOptions,
  sortOptions,
  limitOptions,
  activeFilterCount,
  onUpdate,
  onReset,
}: AdminAuctionFiltersProps) {
  return (
    <Card className="mt-4 overflow-hidden rounded-2xl border-border/70 bg-linear-to-b from-card to-card/70 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.9)]">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Funnel className="size-4 text-blue-500" />
              Review auction filters
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Filter non-draft auctions quickly by type, category, sorting, and
              keywords.
            </p>
          </div>
          {activeFilterCount > 0 ? (
            <Badge
              variant="secondary"
              className="gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            >
              <Sparkles className="size-3" />
              {activeFilterCount} active
            </Badge>
          ) : (
            <Badge variant="outline" className="rounded-full text-[11px]">
              Default
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
              Auction type
            </label>
            <Select
              value={String(filters.auctionType)}
              onValueChange={(v: string) =>
                onUpdate(
                  'auctionType',
                  v as IGetBrowseAuctionsFilter['auctionType']
                )
              }
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
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
              onValueChange={(v: string) => onUpdate('categoryId', v)}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
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
              onValueChange={(v: string) => onUpdate('sort', v)}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
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
              onValueChange={(v: string) =>
                onUpdate('order', v as IGetBrowseAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
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
              onValueChange={(v: string) => onUpdate('limit', Number(v))}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
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

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-2.5">
          <p className="text-[11px] text-muted-foreground">
            Showing results for current filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
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
