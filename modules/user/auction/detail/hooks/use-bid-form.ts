'use client';

import { useState, useCallback } from 'react';
import type { AuctionDetail } from '@/types/auction.type';

export interface UseBidFormOptions {
  auction: AuctionDetail | null;
  onSubmit?: (amount: number) => void;
}

export function useBidForm({ auction, onSubmit }: UseBidFormOptions) {
  const [bidAmount, setBidAmount] = useState(() =>
    auction ? String(auction.startPrice) : ''
  );

  const minBid = auction ? auction.startPrice + auction.minIncrement : 0;
  const step = auction?.minIncrement ?? 1;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const amount = Number(bidAmount);
      if (!Number.isFinite(amount) || amount < minBid) return;
      onSubmit?.(amount);
    },
    [bidAmount, minBid, onSubmit]
  );

  return {
    bidAmount,
    setBidAmount,
    minBid,
    step,
    handleSubmit,
  };
}
