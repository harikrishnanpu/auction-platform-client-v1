'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type {
  AuctionCategory,
  IGetBrowseAuctionsFilter,
} from '@/types/auction.type';

interface FilterOption {
  label: string;
  value: string;
}

interface UserAuctionFiltersProps {
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

export function UserAuctionFilters({
  filters,
  categories,
  auctionTypeOptions,
  sortOptions,
  limitOptions,
  activeFilterCount,
  onUpdate,
  onReset,
}: UserAuctionFiltersProps) {
  return (
    <section
      className={cn(
        'mt-6 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Filters
          </h2>
          <p className="text-xs text-muted-foreground">
            Refine active listings. Results update automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 ? (
            <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {activeFilterCount} active
            </span>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
            onClick={onReset}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <SearchInput
            placeholder="Search by title…"
            value={filters.search}
            onChange={(v) => onUpdate('search', v)}
            debounceMs={500}
            className="h-10 rounded-lg border-border bg-background"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Type</p>
          <div className="flex flex-wrap gap-1.5">
            {auctionTypeOptions.map((o) => {
              const active = String(filters.auctionType) === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    onUpdate(
                      'auctionType',
                      o.value as IGetBrowseAuctionsFilter['auctionType']
                    )
                  }
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-foreground/20 bg-foreground text-background'
                      : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Category
            </label>
            <Select
              value={filters.categoryId}
              onValueChange={(v: string) => onUpdate('categoryId', v)}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background">
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
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Sort
            </label>
            <Select
              value={filters.sort}
              onValueChange={(v: string) => onUpdate('sort', v)}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background">
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
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Order
            </label>
            <Select
              value={filters.order}
              onValueChange={(v: string) =>
                onUpdate('order', v as IGetBrowseAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Per page
            </label>
            <Select
              value={String(filters.limit)}
              onValueChange={(v: string) => onUpdate('limit', Number(v))}
            >
              <SelectTrigger className="h-10 rounded-lg border-border bg-background">
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
      </div>
    </section>
  );
}
