'use client';

import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type {
  IAuctionRoomBid,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';

import {
  formatBidAmount,
  getBidderName,
  getUserInitials,
} from '../seller-room/seller-room-helpers';
import { urCard, urSectionTitle } from './user-room-ui';

type UserAuctionRoomBidHistoryProps = {
  bids: IAuctionRoomBid[];
  participants: IAuctionRoomParticipant[];
  currentLeadUserId?: string | null;
  className?: string;
  onViewAll?: () => void;
};

export function UserAuctionRoomBidHistory({
  bids,
  participants,
  currentLeadUserId,
  className,
  onViewAll,
}: UserAuctionRoomBidHistoryProps) {
  const sorted = useMemo(
    () =>
      [...bids].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [bids]
  );

  const display = sorted.slice(0, 3);

  return (
    <section className={cn(urCard('flex flex-col'), className)}>
      <h2 className={urSectionTitle()}>Bid History</h2>

      <ul className="mt-3 flex-1 space-y-2.5">
        {display.length === 0 ? (
          <li className="py-6 text-center text-xs text-muted-foreground">
            No bids yet
          </li>
        ) : (
          display.map((bid, index) => {
            const name = getBidderName(bid.userId, participants);
            const isLead = index === 0 && currentLeadUserId === bid.userId;

            return (
              <li
                key={bid.id}
                className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5 last:border-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {getUserInitials(name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-xs font-medium">
                        {name}
                      </span>
                      {isLead ? (
                        <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">
                          Current Lead
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {formatBidAmount(bid.amount)}
                  </p>
                  <time
                    className="text-[10px] text-muted-foreground"
                    dateTime={bid.createdAt}
                  >
                    {formatAuctionDateTime(bid.createdAt)}
                  </time>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {bids.length > 0 && onViewAll ? (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
        >
          View all bids
          {sorted.length > 3 ? ` (${sorted.length})` : ''}
          <ChevronRight className="size-3.5" />
        </button>
      ) : null}
    </section>
  );
}
