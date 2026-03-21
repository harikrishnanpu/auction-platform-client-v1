'use client';

import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatAuctionDateTime, formatAuctionPrice } from '@/lib/auction-utils';
import { cn } from '@/lib/utils';

import type {
  AuctionRoomMode,
  IAuctionRoomBid,
} from '../realtime/useAuctionRoomSocket';

type AuctionRoomLiveBidFeedProps = {
  bids: IAuctionRoomBid[];
  mode: AuctionRoomMode;
};

export function AuctionRoomLiveBidFeed({
  bids,
  mode,
}: AuctionRoomLiveBidFeedProps) {
  return (
    <Card className="rounded-xl border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
          <CardTitle className="text-sm font-semibold">Bid activity</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Most recent bids on this lot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul
          className={cn(
            'space-y-2',
            mode === 'ADMIN'
              ? 'max-h-80 overflow-y-auto pr-1'
              : 'max-h-64 overflow-y-auto pr-1'
          )}
        >
          {bids.length === 0 ? (
            <li className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
              No bids yet. Be the first when the room opens.
            </li>
          ) : (
            bids.map((b, index) => (
              <li
                key={b.id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors',
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
                  {formatAuctionPrice(b.amount)}
                </p>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
