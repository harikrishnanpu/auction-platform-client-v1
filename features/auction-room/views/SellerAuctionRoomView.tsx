'use client';

import type { IAuctionDto } from '@/types/auction.type';

import { AuctionRoomCore } from '../components/AuctionRoomCore';

export function SellerAuctionRoomView({
  auctionId,
  initialAuction,
}: {
  auctionId: string;
  initialAuction: IAuctionDto;
}) {
  return (
    <AuctionRoomCore
      auctionId={auctionId}
      mode="SELLER"
      initialAuction={initialAuction}
      allowSendPublicNotification
      showFallbackParticipantStats
    />
  );
}
