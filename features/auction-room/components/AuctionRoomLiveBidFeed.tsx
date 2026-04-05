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
};

export function AuctionRoomLiveBidFeed({
  bids,
  mode,
  isSealedRoom = false,
  isLiveRoom = false,
}: AuctionRoomLiveBidFeedProps) {
  const feedDescription = isLiveRoom
    ? 'Live bidding will appear here'
    : isSealedRoom
      ? 'Most recent sealed entries'
      : 'Most recent bids';

  return (
    <Card className="rounded-lg border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="px-3 py-2 pb-1">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-muted-foreground" aria-hidden />
          <CardTitle className="text-xs font-semibold">Bid activity</CardTitle>
        </div>
        <CardDescription className="text-[10px] leading-tight">
          {feedDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <ul
          className={cn(
            'space-y-1.5',
            mode === 'ADMIN'
              ? 'max-h-72 overflow-y-auto pr-1'
              : 'max-h-52 overflow-y-auto pr-1'
          )}
        >
          {bids.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
              {getBidFeedEmptyMessage(isLiveRoom)}
            </li>
          ) : (
            bids.map((b, index) => (
              <li
                key={b.id}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 transition-colors',
                  index === 0
                    ? 'border-primary/25 bg-primary/5'
                    : 'border-border/50 bg-background/40'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    Bidder{' '}
                    <span className="font-mono">{b.userId.slice(0, 8)}</span>…
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatAuctionDateTime(b.createdAt)}
                  </p>
                </div>
                <p className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                  {formatBidFeedAmountLabel(isSealedRoom, b.amount)}
                </p>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
