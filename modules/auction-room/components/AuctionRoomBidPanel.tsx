'use client';

import { Gavel, Hourglass } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IAuctionDto } from '@/types/auction.type';
import { formatAuctionPrice } from '@/lib/auction-utils';
import { cn } from '@/lib/utils';

type AuctionRoomBidPanelProps = {
  auction: IAuctionDto | null;
  currentBidAmount: number | null;
  nextBidMin: number | null;
  endCountdown: string | null;
  isAuctionEnded: boolean;
  canInteract: boolean;
  showPlaceBid: boolean;
  bidAmount: string;
  onBidAmountChange: (value: string) => void;
  onSubmitBid: () => void;
  parsedBid: number | null;
};

export function AuctionRoomBidPanel({
  auction,
  currentBidAmount,
  nextBidMin,
  endCountdown,
  isAuctionEnded,
  canInteract,
  showPlaceBid,
  bidAmount,
  onBidAmountChange,
  onSubmitBid,
  parsedBid,
}: AuctionRoomBidPanelProps) {
  const bidDisabled =
    parsedBid == null ||
    (nextBidMin != null && parsedBid < nextBidMin) ||
    isAuctionEnded ||
    !canInteract;

  return (
    <Card
      className={cn(
        'rounded-xl border-border/60 shadow-md',
        'bg-linear-to-br from-card via-card to-amber-500/4 dark:to-amber-400/6'
      )}
    >
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Gavel className="size-4" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight">
              Current bid
            </CardTitle>
            <CardDescription className="text-xs">
              Live updates as bids arrive
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
            {currentBidAmount != null
              ? formatAuctionPrice(currentBidAmount)
              : '—'}
          </p>
          {nextBidMin != null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum next bid{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {formatAuctionPrice(nextBidMin)}
              </span>
            </p>
          ) : null}
        </div>

        <div className="grid gap-2 rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Hourglass className="size-4 shrink-0" aria-hidden />
              Time left
            </span>
            <span
              className={cn(
                'font-mono text-base font-semibold tabular-nums',
                endCountdown &&
                  endCountdown !== '0:00' &&
                  endCountdown.length <= 5 &&
                  'text-amber-700 dark:text-amber-400'
              )}
            >
              {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              Anti-snipe {auction?.antiSnipSeconds ?? 0}s
            </Badge>
            <Badge variant="outline" className="font-normal">
              Cooldown {auction?.bidCooldownSeconds ?? 0}s
            </Badge>
            <Badge variant="outline" className="font-normal">
              Max extensions {auction?.maxExtensionCount ?? 0}
            </Badge>
          </div>
        </div>

        {showPlaceBid ? (
          <div className="space-y-2">
            <Input
              inputMode="decimal"
              placeholder={
                nextBidMin != null
                  ? `Amount ≥ ${nextBidMin}`
                  : 'Enter bid amount'
              }
              value={bidAmount}
              onChange={(e) => onBidAmountChange(e.target.value)}
              disabled={!canInteract || isAuctionEnded}
              className="h-10 rounded-lg border-border/80 bg-background text-sm tabular-nums"
            />
            <Button
              size="sm"
              onClick={onSubmitBid}
              disabled={bidDisabled}
              className="h-10 w-full rounded-lg text-sm font-semibold shadow-sm"
            >
              Place bid
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
