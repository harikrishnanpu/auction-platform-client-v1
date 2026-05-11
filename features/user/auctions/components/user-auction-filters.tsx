'use client';

import { Funnel, RotateCcw, SlidersHorizontal } from 'lucide-react';

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
        'mt-6 rounded-[12px] border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
      )}
    >
      <div className="border-b border-border/70 bg-[#f8f9fa] px-4 py-3 dark:bg-muted/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <SlidersHorizontal
                className="size-4 text-foreground/80"
                aria-hidden
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Search & filters
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Narrow active listings — monochrome UI per design system.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 ? (
              <span className="rounded-full border border-border/80 bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-medium text-foreground dark:bg-muted">
                {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'}
              </span>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-[8px] border-border/80 text-xs"
              onClick={onReset}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
            Search
          </label>
          <SearchInput
            placeholder="Search by title…"
            value={filters.search}
            onChange={(v) => onUpdate('search', v)}
            debounceMs={500}
            className="h-10 rounded-[8px] border-border/80 bg-background"
          />
        </div>

        <div className="rounded-[12px] bg-[#f5f5f5] p-2 dark:bg-muted/40">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Auction type
          </p>
          <div className="flex flex-wrap gap-1">
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
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-muted-foreground hover:text-foreground'
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
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Category
            </label>
            <Select
              value={filters.categoryId}
              onValueChange={(v: string) => onUpdate('categoryId', v)}
            >
              <SelectTrigger className="h-10 rounded-[8px] border-border/80 bg-background text-sm">
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
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Sort by
            </label>
            <Select
              value={filters.sort}
              onValueChange={(v: string) => onUpdate('sort', v)}
            >
              <SelectTrigger className="h-10 rounded-[8px] border-border/80 bg-background text-sm">
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
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Order
            </label>
            <Select
              value={filters.order}
              onValueChange={(v: string) =>
                onUpdate('order', v as IGetBrowseAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-10 rounded-[8px] border-border/80 bg-background text-sm">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Per page
            </label>
            <Select
              value={String(filters.limit)}
              onValueChange={(v: string) => onUpdate('limit', Number(v))}
            >
              <SelectTrigger className="h-10 rounded-[8px] border-border/80 bg-background text-sm">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} listings
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-[8px] border border-dashed border-border/70 bg-[#f8f9fa] px-3 py-2 text-[11px] text-muted-foreground dark:bg-muted/20">
          <Funnel className="size-3.5 shrink-0 opacity-70" aria-hidden />
          Active auctions only. Adjust filters to refresh results.
        </div>
      </div>
    </section>
  );
}
