'use client';

import type { IAuctionDto } from '@/types/auction.type';

import type { AuctionRoomMode } from '@/types/auctionRoom.types';

import { AuctionRoomCore } from './AuctionRoomCore';
export function AuctionRoom({
  auctionId,
  mode,
  initialAuction,
}: {
  auctionId: string;
  mode: AuctionRoomMode;
  initialAuction?: IAuctionDto;
}) {
  return (
    <AuctionRoomCore
      auctionId={auctionId}
      mode={mode}
      initialAuction={initialAuction}
      allowSendPublicNotification={mode === 'SELLER'}
      showFallbackParticipantStats={mode === 'SELLER' || mode === 'ADMIN'}
    />
  );
}
