'use client';

import { useMemo } from 'react';
import { AuctionListCard } from './auction-list-card';
import type { BrowseAuctionListItem } from '@/types/auction.type';

export interface AuctionListGridProps {
  auctions: BrowseAuctionListItem[];
  searchQuery: string;
  emptyMessage?: string;
  emptyFilterMessage?: string;
}

export function AuctionListGrid({
  auctions,
  searchQuery,
  emptyMessage = 'No active auctions at the moment.',
  emptyFilterMessage = 'No auctions match your filters.',
}: AuctionListGridProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return auctions;
    const q = searchQuery.trim().toLowerCase();
    return auctions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [auctions, searchQuery]);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {auctions.length === 0 ? emptyMessage : emptyFilterMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((auction) => (
        <AuctionListCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
