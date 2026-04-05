'use client';

import { Gavel, RotateCcw } from 'lucide-react';

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
import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  UserAuctionsCards,
  UserAuctionsCardsSkeleton,
} from './user-auctions-cards';
import { useUserParticipatedAuctions } from '../hooks/use-user-participated-auctions';
import type { IGetMyAuctionsFilter } from '@/types/auction.type';

const TYPE_OPTIONS: Array<{
  label: string;
  value: IGetMyAuctionsFilter['auctionType'];
}> = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Long', value: 'LONG' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Sealed', value: 'SEALED' },
];

const STATUS_OPTIONS: Array<{
  label: string;
  value: IGetMyAuctionsFilter['status'];
}> = [
  { label: 'All Status', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Ended', value: 'ENDED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const LIMIT_OPTIONS = [10, 20, 50];

export function ProfileMyAuctionsView() {
  const {
    filters,
    data,
    loading,
    error,
    updateFilter,
    resetFilters,
    activeFilterCount,
  } = useUserParticipatedAuctions();

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Gavel className="h-5 w-5" />
          My Auctions
        </h1>
        <p className="text-sm text-muted-foreground">
          Auctions you participated in, across all statuses.
        </p>
      </div>

      <Card className="rounded-lg border-border/70 bg-card/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">Filters</CardTitle>
            {activeFilterCount > 0 ? (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            ) : (
              <Badge variant="outline">Default</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div className="md:col-span-2 xl:col-span-4">
              <SearchInput
                placeholder="Search auction title..."
                value={filters.search}
                onChange={(v) => updateFilter('search', v)}
                debounceMs={500}
              />
            </div>

            <Select
              value={filters.auctionType}
              onValueChange={(v) =>
                updateFilter(
                  'auctionType',
                  v as IGetMyAuctionsFilter['auctionType']
                )
              }
            >
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="Auction type" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(v) =>
                updateFilter('status', v as IGetMyAuctionsFilter['status'])
              }
            >
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.order}
              onValueChange={(v) =>
                updateFilter('order', v as IGetMyAuctionsFilter['order'])
              }
            >
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(filters.limit)}
              onValueChange={(v) => updateFilter('limit', Number(v))}
            >
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={resetFilters}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <UserAuctionsCardsSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <UserAuctionsCards auctions={data?.auctions ?? []} sortMode="none" />
          <PaginationControls
            page={data?.currentPage ?? filters.page}
            totalPages={data?.totalPages ?? 1}
            onPrev={() => updateFilter('page', Math.max(1, filters.page - 1))}
            onNext={() =>
              updateFilter(
                'page',
                Math.min(data?.totalPages ?? 1, filters.page + 1)
              )
            }
          />
        </>
      )}
    </section>
  );
}
