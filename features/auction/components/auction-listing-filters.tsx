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
import type { AuctionCategory } from '@/types/auction.type';

export interface AuctionFilterOption {
  label: string;
  value: string;
}

export interface AuctionListingFiltersValues {
  search: string;
  categoryId: string;
  auctionType: string;
  sort: string;
  order: 'asc' | 'desc';
  limit: number;
  /** When `statusOptions` is set, pass current status (e.g. seller listings). */
  status?: string;
}

export type AuctionListingFiltersPatch = Partial<AuctionListingFiltersValues>;

export interface AuctionListingFiltersProps {
  values: AuctionListingFiltersValues;
  categories: AuctionCategory[];
  auctionTypeOptions: AuctionFilterOption[];
  sortOptions: AuctionFilterOption[];
  limitOptions: number[];
  /** Renders a “Status” pill row before “Type” (seller). */
  statusOptions?: AuctionFilterOption[];
  activeFilterCount: number;
  onPatch: (patch: AuctionListingFiltersPatch) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  className?: string;
}

export function AuctionListingFilters({
  values,
  categories,
  auctionTypeOptions,
  sortOptions,
  limitOptions,
  statusOptions,
  activeFilterCount,
  onPatch,
  onReset,
  searchPlaceholder = 'Search by title…',
  className,
}: AuctionListingFiltersProps) {
  const statusVal = values.status ?? 'ALL';
  const showStatus = Boolean(statusOptions && statusOptions.length > 0);
  const pillActive =
    'border-brand-600 bg-brand-600 text-white shadow-sm hover:bg-brand-700';
  const pillInactive =
    'border-transparent bg-muted/40 text-muted-foreground hover:border-border/80 hover:bg-muted/60 hover:text-foreground';

  return (
    <section className={cn('border-b border-border/60 pb-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
        <div
          className={cn(
            'flex min-h-10 min-w-0 flex-1 overflow-hidden rounded-xl border border-border/80 bg-card',
            'shadow-sm transition-[box-shadow,border-color]',
            'focus-within:border-brand-600/40 focus-within:ring-2 focus-within:ring-brand-600/20'
          )}
        >
          <Select
            value={values.categoryId}
            onValueChange={(v) => onPatch({ categoryId: v })}
          >
            <SelectTrigger
              className={cn(
                'h-10 w-[min(46%,12.5rem)] shrink-0 rounded-none border-0 border-r border-border/70',
                'bg-muted/35 px-3 text-sm font-medium shadow-none',
                'focus-visible:z-10 focus-visible:ring-0 focus-visible:ring-offset-0',
                '[&_svg]:opacity-60 [&>span]:truncate'
              )}
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-48">
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SearchInput
            placeholder={searchPlaceholder}
            value={values.search}
            onChange={(v) => onPatch({ search: v })}
            debounceMs={400}
            className="min-w-0 flex-1"
            inputClassName={cn(
              'h-10 rounded-none border-0 bg-transparent py-0 text-sm',
              'shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0 gap-2 rounded-full border-border/80 px-4 text-sm font-medium"
          onClick={onReset}
        >
          <RotateCcw className="size-4" />
          Reset
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground tabular-nums">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
        {showStatus ? (
          <>
            <span className="text-xs font-medium text-muted-foreground">
              Status
            </span>
            {statusOptions!.map((o) => {
              const active = statusVal === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onPatch({ status: o.value })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    active ? pillActive : pillInactive
                  )}
                >
                  {o.label}
                </button>
              );
            })}
            <span
              className="mx-0.5 hidden h-5 w-px bg-border/80 sm:mx-1 sm:block"
              aria-hidden
            />
          </>
        ) : null}

        <span className="text-xs font-medium text-muted-foreground">Type</span>
        {auctionTypeOptions.map((o) => {
          const active = String(values.auctionType) === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onPatch({ auctionType: o.value })}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                active ? pillActive : pillInactive
              )}
            >
              {o.label}
            </button>
          );
        })}

        <span
          className="mx-0.5 hidden h-5 w-px bg-border/80 sm:mx-1 sm:block"
          aria-hidden
        />

        <span className="text-xs font-medium text-muted-foreground">Sort</span>
        <Select value={values.sort} onValueChange={(v) => onPatch({ sort: v })}>
          <SelectTrigger className="h-9 min-w-0 max-w-34 shrink rounded-full border-border/70 bg-muted/25 px-3 text-xs font-medium sm:max-w-32">
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

        <div
          className="inline-flex h-9 shrink-0 overflow-hidden rounded-full border border-border/70 text-xs font-medium"
          role="group"
          aria-label="Sort order"
        >
          <button
            type="button"
            onClick={() => onPatch({ order: 'asc' })}
            className={cn(
              'border-r border-border/60 px-3 transition-colors',
              values.order === 'asc'
                ? 'bg-brand-600 text-white'
                : 'bg-background text-muted-foreground hover:bg-muted/50'
            )}
          >
            Asc
          </button>
          <button
            type="button"
            onClick={() => onPatch({ order: 'desc' })}
            className={cn(
              'px-3 transition-colors',
              values.order === 'desc'
                ? 'bg-brand-600 text-white'
                : 'bg-background text-muted-foreground hover:bg-muted/50'
            )}
          >
            Desc
          </button>
        </div>

        <span className="text-xs font-medium text-muted-foreground">
          Page size
        </span>
        <div className="inline-flex flex-wrap items-center gap-1.5">
          {limitOptions.map((n) => {
            const active = values.limit === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPatch({ limit: n })}
                className={cn(
                  'inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2.5 text-xs font-medium tabular-nums transition-colors',
                  active ? pillActive : pillInactive
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
