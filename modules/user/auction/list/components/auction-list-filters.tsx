'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type {
  CategoryFilter,
  TypeFilterValue,
} from '../hooks/use-auction-list-filters';

export interface AuctionListFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  typeFilter: TypeFilterValue;
  onTypeChange: (value: TypeFilterValue) => void;
  categoryOptions: readonly string[];
  typeOptions: readonly { value: string; label: string }[];
}

export function AuctionListFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  categoryOptions,
  typeOptions,
}: AuctionListFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search auctions"
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Category:</span>
        {categoryOptions.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c as CategoryFilter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Type:</span>
        {typeOptions.map(({ value, label }) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => onTypeChange(value as TypeFilterValue)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
