'use client';

import { Loader2 } from 'lucide-react';
import { useAuctionRoomData } from '../hooks/use-auction-room-data';
import { AuctionRoomView } from './auction-room-view';
import Link from 'next/link';

export interface AuctionRoomLoaderProps {
  auctionId: string;
}

export function AuctionRoomLoader({ auctionId }: AuctionRoomLoaderProps) {
  const { auction, isLoading, isError, error, refetch } = useAuctionRoomData({
    auctionId,
    enabled: Boolean(auctionId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2
          className="h-10 w-10 animate-spin text-muted-foreground"
          aria-hidden
        />
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error instanceof Error ? error.message : 'Auction not found'}
          </p>
          <Link href="/auctions" className="text-primary underline">
            Back to auctions
          </Link>
        </div>
      </div>
    );
  }

  return <AuctionRoomView auction={auction} onAuctionRefetch={refetch} />;
}
