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
import type { IGetMyAuctionsFilter } from '@/types/auction.type';

const PILL_ACTIVE =
  'border-brand-600 bg-brand-600 text-white shadow-sm hover:bg-brand-700';
const PILL_INACTIVE =
  'border-transparent bg-muted/40 text-muted-foreground hover:border-border/80 hover:bg-muted/60 hover:text-foreground';

const TYPE_OPTIONS: Array<{
  label: string;
  value: IGetMyAuctionsFilter['auctionType'];
}> = [
  { label: 'All types', value: 'ALL' },
  { label: 'Long', value: 'LONG' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Sealed', value: 'SEALED' },
];

const STATUS_OPTIONS: Array<{
  label: string;
  value: IGetMyAuctionsFilter['status'];
}> = [
  { label: 'All status', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Ended', value: 'ENDED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const LIMIT_OPTIONS = [10, 20, 50] as const;

const selectTriggerClass =
  'h-9 w-full rounded-lg border-border/80 bg-card text-[13px] font-medium shadow-sm';

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-[13px]"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface MyAuctionsFiltersProps {
  filters: IGetMyAuctionsFilter;
  activeFilterCount: number;
  onPatch: <K extends keyof IGetMyAuctionsFilter>(
    key: K,
    value: IGetMyAuctionsFilter[K]
  ) => void;
  onReset: () => void;
}

export function MyAuctionsFilters({
  filters,
  activeFilterCount,
  onPatch,
  onReset,
}: MyAuctionsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
        <div
          className={cn(
            'flex min-h-9 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card',
            'shadow-sm transition-[box-shadow,border-color]',
            'focus-within:border-brand-600/40 focus-within:ring-2 focus-within:ring-brand-600/20'
          )}
        >
          <SearchInput
            placeholder="Search by auction title…"
            value={filters.search}
            onChange={(v) => onPatch('search', v)}
            debounceMs={500}
            className="min-w-0 flex-1"
            inputClassName={cn(
              'h-9 rounded-none border-0 bg-transparent py-0 text-[13px]',
              'shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 rounded-full border-border px-3.5 text-[13px] font-medium"
          onClick={onReset}
        >
          <RotateCcw className="size-3.5" />
          Reset
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal tabular-nums text-muted-foreground">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            label="Status"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(v) => onPatch('status', v)}
          />
          <FilterSelect
            label="Type"
            value={filters.auctionType}
            options={TYPE_OPTIONS}
            onChange={(v) => onPatch('auctionType', v)}
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-border/50 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Order
            </span>
            <div
              className="inline-flex h-8 shrink-0 overflow-hidden rounded-full border border-border/70 text-xs font-medium"
              role="group"
              aria-label="Sort order"
            >
              <button
                type="button"
                onClick={() => onPatch('order', 'desc')}
                className={cn(
                  'border-r border-border/60 px-3 transition-colors',
                  filters.order === 'desc'
                    ? 'bg-brand-600 text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted/50'
                )}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => onPatch('order', 'asc')}
                className={cn(
                  'px-3 transition-colors',
                  filters.order === 'asc'
                    ? 'bg-brand-600 text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted/50'
                )}
              >
                Oldest
              </button>
            </div>
          </div>

          <span className="hidden h-5 w-px bg-border/80 sm:block" aria-hidden />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Per page
            </span>
            <div className="inline-flex flex-wrap gap-1.5">
              {LIMIT_OPTIONS.map((n) => {
                const active = filters.limit === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onPatch('limit', n)}
                    className={cn(
                      'inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-xs font-medium tabular-nums transition-colors',
                      active ? PILL_ACTIVE : PILL_INACTIVE
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
