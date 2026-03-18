'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { AuctionCategory } from '@/types/auction.type';
import { flattenCategoryTree } from '@/modules/admin/auctions/components/categories/category-utils';

export function SellerCategorySelect({
  id,
  value,
  onChange,
  categories,
  placeholder = 'Select category',
  disabled,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  categories: AuctionCategory[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) {
  const options = useMemo(() => {
    const verified = categories.filter((c) => c.isVerified);
    return flattenCategoryTree(verified).map((c) => ({
      value: c.name,
      label: c.pathLabel,
      depth: c.depth,
    }));
  }, [categories]);

  return (
    <div className="space-y-1">
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.label} value={o.value}>
            {`${'— '.repeat(o.depth)}${o.label}`}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between gap-3">
        {error ? <p className="text-destructive text-xs">{error}</p> : <span />}
        <Link
          href="/seller/auction/categories"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Request a new category
        </Link>
      </div>
    </div>
  );
}
