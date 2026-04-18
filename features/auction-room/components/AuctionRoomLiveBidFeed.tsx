'use client';

import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

import {
  formatBidFeedAmountLabel,
  getBidFeedEmptyMessage,
} from '../utils/auction-room.utils';

import type {
  AuctionRoomMode,
  IAuctionRoomBid,
} from '../../../socket/useAuctionRoomSocket';

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
    ? 'Live bids appear here'
    : isSealedRoom
      ? 'Latest sealed bids'
      : 'Recent bids';

  return (
    <Card className="rounded-xl border-border/50 bg-card/30 shadow-none">
      <CardHeader className="space-y-0 border-b border-border/35 px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3 text-muted-foreground" aria-hidden />
          <CardTitle className="text-xs font-semibold tracking-tight">
            Bid activity
          </CardTitle>
        </div>
        <CardDescription className="text-[10px] leading-snug">
          {feedDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2.5 pb-2 pt-1.5">
        <ul
          className={cn(
            'space-y-1',
            mode === 'ADMIN'
              ? 'max-h-48 overflow-y-auto pr-0.5 [scrollbar-width:thin]'
              : 'max-h-40 overflow-y-auto pr-0.5 [scrollbar-width:thin]'
          )}
        >
          {bids.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border/50 bg-muted/15 px-2 py-3 text-center text-[10px] text-muted-foreground">
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
                    'flex items-center justify-between gap-2 rounded-lg border px-2 py-1 transition-colors',
                    index === 0
                      ? 'border-primary/25 bg-primary/[0.05]'
                      : 'border-border/40 bg-background/40',
                    isYou && 'ring-1 ring-foreground/10'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-foreground">
                      {isYou ? (
                        'You'
                      ) : mode === 'ADMIN' ? (
                        <>
                          <span className="font-mono">
                            {b.userId.slice(0, 8)}
                          </span>
                          …
                        </>
                      ) : (
                        'Bidder'
                      )}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {formatAuctionDateTime(b.createdAt)}
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
                    {formatBidFeedAmountLabel(isSealedRoom, b.amount)}
                  </p>
                </li>
              );
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
