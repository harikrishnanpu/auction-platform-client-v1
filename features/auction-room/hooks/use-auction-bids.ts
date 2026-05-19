'use client';

import { useCallback, useState } from 'react';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import type { IAuctionRoomBid } from '@/types/auctionRoom.types';

type AuctionBidsPayload = {
  bids: IAuctionRoomBid[];
  total: number;
};

export function useAuctionBids(auctionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<IAuctionRoomBid[]>([]);
  const [total, setTotal] = useState(0);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.auction.getAuctionBids(auctionId)),
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        }
      );

      const body = (await res.json()) as {
        success?: boolean;
        data?: AuctionBidsPayload;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(body.message ?? 'Failed to load bids');
      }

      const data = body.data;
      setBids(data?.bids ?? []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bids');
      setBids([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  return { bids, total, loading, error, fetchBids };
}
