'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  X,
  RotateCcw,
} from 'lucide-react';
import { AuthProvider, UserRole, UserStatus } from '@/types/user.type';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect, FilterOption } from '@/components/ui/filter-select';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: FilterOption[] = [
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Date Joined', value: 'createdAt' },
  { label: 'Last Updated', value: 'updatedAt' },
];

const LIMIT_OPTIONS: FilterOption[] = [
  { label: '5 per page', value: '5' },
  { label: '10 per page', value: '10' },
  { label: '20 per page', value: '20' },
  { label: '50 per page', value: '50' },
];

const ROLE_OPTIONS: FilterOption[] = [
  { label: 'Admin', value: UserRole.ADMIN },
  { label: 'User', value: UserRole.USER },
  { label: 'Seller', value: UserRole.SELLER },
  { label: 'Moderator', value: UserRole.MODERATOR },
];

const STATUS_OPTIONS: FilterOption[] = [
  { label: 'Active', value: UserStatus.ACTIVE },
  { label: 'Blocked', value: UserStatus.BLOCKED },
  { label: 'Pending', value: UserStatus.PENDING },
];

const AUTH_PROVIDER_OPTIONS: FilterOption[] = [
  { label: 'Google', value: AuthProvider.GOOGLE },
  { label: 'Email / OTP', value: AuthProvider.EMAIL },
  { label: 'Local (Password)', value: AuthProvider.LOCAL },
];

export interface UserFilterState {
  search: string;
  sort: string;
  order: 'asc' | 'desc';
  limit: number;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  authProvider: AuthProvider | 'all';
}

export const DEFAULT_FILTERS: UserFilterState = {
  search: '',
  sort: 'createdAt',
  order: 'desc',
  limit: 10,
  role: 'all',
  status: 'all',
  authProvider: 'all',
};

interface UserFiltersProps {
  filters: UserFilterState;
  onChange: (filters: UserFilterState) => void;
  onReset: () => void;
  totalUsers?: number;
  className?: string;
}

// ─── Active filter count ──────────────────────────────────────────────────────

function countActiveFilters(filters: UserFilterState): number {
  let count = 0;
  if (filters.role !== 'all') count++;
  if (filters.status !== 'all') count++;
  if (filters.authProvider !== 'all') count++;
  if (
    filters.sort !== DEFAULT_FILTERS.sort ||
    filters.order !== DEFAULT_FILTERS.order
  )
    count++;
  return count;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserFilters({
  filters,
  onChange,
  onReset,
  totalUsers,
  className,
}: UserFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  const set = <K extends keyof UserFilterState>(
    key: K,
    value: UserFilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleOrder = () =>
    set('order', filters.order === 'asc' ? 'desc' : 'asc');

  return (
    <div className={cn('mb-6 space-y-3', className)}>
      {/* ── Top bar: search + sort quick picks + filter button ── */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        {/* Search */}
        <SearchInput
          placeholder="Search by name or email…"
          value={filters.search}
          onChange={(v) => set('search', v)}
          debounceMs={500}
          className="sm:max-w-sm"
        />

        {/* Sort by – quick select visible on md+ */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Sort by
          </span>
          <Select value={filters.sort} onValueChange={(v) => set('sort', v)}>
            <SelectTrigger className="h-9 w-40 text-sm rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Order toggle */}
          <button
            onClick={toggleOrder}
            className="h-9 px-3 flex items-center gap-1.5 text-sm border border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition"
            title="Toggle sort direction"
          >
            {filters.order === 'asc' ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            <span className="hidden lg:inline">
              {filters.order === 'asc' ? 'Ascending' : 'Descending'}
            </span>
          </button>

          {/* Limit */}
          <Select
            value={String(filters.limit)}
            onValueChange={(v) => set('limit', Number(v))}
          >
            <SelectTrigger className="h-9 w-36 text-sm rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter sheet trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2 h-9 rounded-lg shrink-0"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 sm:w-96 flex flex-col gap-0 p-0"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filters & Sort
                </SheetTitle>
                {activeCount > 0 && (
                  <button
                    onClick={() => {
                      onReset();
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition"
                  >
                    <RotateCcw size={12} />
                    Reset all
                  </button>
                )}
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Sort – mobile section */}
              <section className="md:hidden space-y-3">
                <SectionHeading>Sort</SectionHeading>
                <FilterSelect
                  label="Sort by"
                  value={filters.sort}
                  options={SORT_OPTIONS}
                  onChange={(v) => set('sort', v)}
                  placeholder="Date joined"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Order
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-input">
                    {(['asc', 'desc'] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => set('order', o)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-2 text-sm transition',
                          filters.order === o
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'bg-background text-muted-foreground hover:bg-accent'
                        )}
                      >
                        {o === 'asc' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                        {o === 'asc' ? 'Ascending' : 'Descending'}
                      </button>
                    ))}
                  </div>
                </div>
                <FilterSelect
                  label="Items per page"
                  value={String(filters.limit)}
                  options={LIMIT_OPTIONS}
                  onChange={(v) => set('limit', Number(v))}
                  placeholder="10 per page"
                />
              </section>

              {/* Sort – desktop section (limit only since sort bar is outside) */}
              <section className="hidden md:block space-y-3">
                <SectionHeading>Pagination</SectionHeading>
                <FilterSelect
                  label="Items per page"
                  value={String(filters.limit)}
                  options={LIMIT_OPTIONS}
                  onChange={(v) => set('limit', Number(v))}
                  placeholder="10 per page"
                />
              </section>

              <Divider />

              {/* Role */}
              <section className="space-y-3">
                <SectionHeading>Role</SectionHeading>
                <ToggleGroup
                  options={ROLE_OPTIONS}
                  value={filters.role as string}
                  onChange={(v) => set('role', v as UserRole | 'all')}
                />
              </section>

              <Divider />

              {/* Status */}
              <section className="space-y-3">
                <SectionHeading>Account Status</SectionHeading>
                <ToggleGroup
                  options={STATUS_OPTIONS}
                  value={filters.status as string}
                  onChange={(v) => set('status', v as UserStatus | 'all')}
                />
              </section>

              <Divider />

              {/* Auth Provider */}
              <section className="space-y-3">
                <SectionHeading>Auth Provider</SectionHeading>
                <ToggleGroup
                  options={AUTH_PROVIDER_OPTIONS}
                  value={filters.authProvider as string}
                  onChange={(v) =>
                    set('authProvider', v as AuthProvider | 'all')
                  }
                />
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {totalUsers !== undefined
                  ? `${totalUsers} user${totalUsers !== 1 ? 's' : ''} found`
                  : ''}
              </span>
              <Button
                size="sm"
                className="rounded-lg gap-1.5"
                onClick={() => setSheetOpen(false)}
              >
                Apply
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Active filter chips ── */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground">Active:</span>
          {filters.role !== 'all' && (
            <FilterChip
              label={`Role: ${filters.role}`}
              onRemove={() => set('role', 'all')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => set('status', 'all')}
            />
          )}
          {filters.authProvider !== 'all' && (
            <FilterChip
              label={`Provider: ${filters.authProvider}`}
              onRemove={() => set('authProvider', 'all')}
            />
          )}
          {(filters.sort !== DEFAULT_FILTERS.sort ||
            filters.order !== DEFAULT_FILTERS.order) && (
            <FilterChip
              label={`Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? filters.sort} (${filters.order})`}
              onRemove={() => {
                set('sort', DEFAULT_FILTERS.sort);
                set('order', DEFAULT_FILTERS.order);
              }}
            />
          )}
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-destructive transition ml-1 flex items-center gap-1"
          >
            <RotateCcw size={11} />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

function Divider() {
  return <hr className="border-border" />;
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 pr-1 rounded-full font-normal text-xs cursor-default"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:text-destructive transition rounded-full p-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </Badge>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
          value === 'all'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value === value ? 'all' : opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
