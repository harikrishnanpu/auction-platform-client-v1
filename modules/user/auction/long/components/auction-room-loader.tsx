'use client';

import { Auction } from '@/types/auction.types';
import { AuctionRoomView } from './auction-room-view';

function getDummyAuction(auctionId: string): Auction {
  const now = new Date();
  const startTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  return {
    auctionId: auctionId || 'dummy-auction-id',
    sellerId: 'dummy-seller-id',
    title: 'Dummy Auction Room',
    description: 'Sample auction for demo.',
    category: 'Watches',
    condition: 'Used - Good',
    startPrice: 5000,
    minIncrement: 100,
    startTime,
    endTime,
    status: 'ACTIVE',
    media: [
      {
        url: '/placeholder.svg',
        isPrimary: true,
        type: 'IMAGE',
      },
    ],
    bidCooldownSeconds: 10,
    antiSnipeThresholdSeconds: 60,
    isPaused: false,
    winnerId: null,
  };
}

export interface AuctionRoomLoaderProps {
  auctionId: string;
}

export function AuctionRoomLoader({ auctionId }: AuctionRoomLoaderProps) {
  const auction = getDummyAuction(auctionId);

  return <AuctionRoomView auction={auction} onAuctionRefetch={() => {}} />;
}
