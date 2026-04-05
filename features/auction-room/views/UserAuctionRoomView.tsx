'use client';

import { AuctionRoomCore } from '../components/AuctionRoomCore';

export function UserAuctionRoomView({ auctionId }: { auctionId: string }) {
  return (
    <AuctionRoomCore
      auctionId={auctionId}
      mode="USER"
      allowSendPublicNotification={false}
      showFallbackParticipantStats={false}
    />
  );
}
