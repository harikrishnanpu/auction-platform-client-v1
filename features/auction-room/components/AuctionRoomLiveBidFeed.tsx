'use client';

import { TrendingUp } from 'lucide-react';

import { formatAuctionDateTime } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

import {
  formatBidFeedAmountLabel,
  getBidFeedEmptyMessage,
} from '../utils/auction-room.utils';

import type {
  AuctionRoomMode,
  IAuctionRoomBid,
} from '@/types/auctionRoom.types';

import { arCardCanvas, arType } from '../lib/auction-room-design';

type AuctionRoomLiveBidFeedProps = {
  bids: IAuctionRoomBid[];
  mode: AuctionRoomMode;
  isSealedRoom?: boolean;
  isLiveRoom?: boolean;
  currentUserId?: string;
};

export function AuctionRoomLiveBidFeed({
  bids,
  mode,
  isSealedRoom = false,
  isLiveRoom = false,
  currentUserId,
}: AuctionRoomLiveBidFeedProps) {
  const feedDescription = isLiveRoom
    ? 'Updates as bids arrive'
    : isSealedRoom
      ? 'Latest sealed activity'
      : 'Recent bids';

  return (
    <section className={arCardCanvas('overflow-hidden')}>
      <div className="border-b border-border/80 px-2.5 py-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-muted/50 text-foreground">
            <TrendingUp className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className={arType.cardTitle}>Bid activity</h3>
            <p className={arType.cardDesc}>{feedDescription}</p>
          </div>
        </div>
      </div>
      <div className="px-2.5 py-2">
        <ul
          className={cn(
            'space-y-1.5',
            mode === 'ADMIN'
              ? 'max-h-44 overflow-y-auto pr-1 [scrollbar-width:thin]'
              : 'max-h-40 overflow-y-auto pr-1 [scrollbar-width:thin]'
          )}
        >
          {bids.length === 0 ? (
            <li className="rounded-[8px] border border-dashed border-border/80 bg-muted/30 px-3 py-4 text-center text-xs text-muted-foreground dark:bg-muted/20">
              {getBidFeedEmptyMessage(isLiveRoom)}
            </li>
          ) : (
            bids.map((b, index) => {
              const isYou = Boolean(
                currentUserId && b.userId === currentUserId
              );
              return (
                <li
                  key={b.id}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-[8px] border px-2 py-1.5 transition-colors',
                    index === 0
                      ? 'border-primary/20 bg-muted/50'
                      : 'border-border/80 bg-card',
                    isYou && 'ring-1 ring-primary/15'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {isYou ? (
                        'You'
                      ) : mode === 'ADMIN' ? (
                        <>
                          <span className="font-mono text-[11px]">
                            {b.userId.slice(0, 8)}
                          </span>
                          …
                        </>
                      ) : (
                        'Bidder'
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatAuctionDateTime(b.createdAt)}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                    {formatBidFeedAmountLabel(isSealedRoom, b.amount)}
                  </p>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </section>
  );
}
