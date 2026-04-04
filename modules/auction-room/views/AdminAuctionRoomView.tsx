'use client';

import { AuctionRoomCore } from '../components/AuctionRoomCore';

export function AdminAuctionRoomView({ auctionId }: { auctionId: string }) {
  return (
    <AuctionRoomCore
      auctionId={auctionId}
      mode="ADMIN"
      allowSendPublicNotification={false}
      showFallbackParticipantStats
    />
  );
}
