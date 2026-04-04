'use client';

import type { IAuctionDto } from '@/types/auction.type';

import type { AuctionRoomMode } from '../../../socket/useAuctionRoomSocket';

import { AuctionRoomCore } from './AuctionRoomCore';

/**
 * Back-compat wrapper: maps `mode` to role flags. Prefer UserAuctionRoomView,
 * SellerAuctionRoomView, or AdminAuctionRoomView from `modules/auction-room/views/`.
 */
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
