'use client';

import { formatAuctionDateTime } from '@/utils/auction-utils';
import type { IAuctionRoomParticipant } from '@/types/auctionRoom.types';

import { getUserInitials } from './seller-room/seller-room-helpers';

type AuctionRoomParticipantsTabProps = {
  participants: IAuctionRoomParticipant[];
  hostUserId?: string | null;
  hostBadge?: string;
  hostIsSelf?: boolean;
};

export function AuctionRoomParticipantsTab({
  participants,
  hostUserId,
  hostBadge = 'Host',
  hostIsSelf = false,
}: AuctionRoomParticipantsTabProps) {
  const sorted = [...participants].sort(
    (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
  );

  return (
    <ul className="absolute inset-0 overflow-y-auto overscroll-y-contain px-3 py-2 touch-pan-y [-webkit-overflow-scrolling:touch]">
      {sorted.length === 0 ? (
        <li className="py-8 text-center text-xs text-muted-foreground">
          No participants yet
        </li>
      ) : (
        sorted.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-2.5 border-b border-border/60 py-2.5 last:border-0"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
              {getUserInitials(p.userName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{p.userName}</p>
              <p className="text-[10px] text-muted-foreground">
                Joined {formatAuctionDateTime(p.joinedAt)}
              </p>
            </div>
            {hostUserId && p.userId === hostUserId ? (
              <span
                className={
                  hostIsSelf
                    ? 'shrink-0 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-white'
                    : 'shrink-0 rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700'
                }
              >
                {hostBadge}
              </span>
            ) : null}
          </li>
        ))
      )}
    </ul>
  );
}
