'use client';

import { Gavel, Hourglass } from 'lucide-react';

import { PlaceBidButton } from '@/components/auction/place-bid-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IAuctionDto } from '@/types/auction.type';
import { formatAuctionPrice } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

type AuctionRoomBidPanelProps = {
  auction: IAuctionDto | null;
  currentBidAmount: number | null;
  nextBidMin: number | null;
  endCountdown: string | null;
  isAuctionEnded: boolean;
  isAuctionActive: boolean;
  canInteract: boolean;
  showPlaceBid: boolean;
  bidAmount: string;
  onBidAmountChange: (value: string) => void;
  onSubmitBid: () => void;
  parsedBid: number | null;
  cooldownRemainingSeconds: number;
  placingBid: boolean;
};

export function AuctionRoomBidPanel({
  auction,
  currentBidAmount,
  nextBidMin,
  endCountdown,
  isAuctionEnded,
  isAuctionActive,
  canInteract,
  showPlaceBid,
  bidAmount,
  onBidAmountChange,
  onSubmitBid,
  parsedBid,
  cooldownRemainingSeconds,
  placingBid,
}: AuctionRoomBidPanelProps) {
  const inputDisabled = !canInteract || isAuctionEnded || !isAuctionActive;

  const bidInvalid =
    parsedBid == null ||
    (nextBidMin != null && parsedBid < nextBidMin) ||
    isAuctionEnded ||
    !canInteract ||
    !isAuctionActive;

  return (
    <Card
      className={cn(
        'rounded-lg border-border/60 shadow-sm',
        'bg-linear-to-br from-card via-card to-amber-500/4 dark:to-amber-400/6'
      )}
    >
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gavel className="size-3.5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-xs font-semibold tracking-tight">
              Current bid
            </CardTitle>
            <CardDescription className="text-[10px] leading-tight">
              Live updates as bids arrive
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">
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

        <div className="grid gap-1.5 rounded-lg border border-border/60 bg-background/60 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Hourglass className="size-3.5 shrink-0" aria-hidden />
              Time left
            </span>
            <span
              className={cn(
                'font-mono text-sm font-semibold tabular-nums',
                endCountdown &&
                  endCountdown !== '0:00' &&
                  endCountdown.length <= 5 &&
                  'text-amber-700 dark:text-amber-400'
              )}
            >
              {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="px-1.5 py-0 font-normal">
              Anti-snipe {auction?.antiSnipSeconds ?? 0}s
            </Badge>
            <Badge variant="outline" className="px-1.5 py-0 font-normal">
              Cooldown {auction?.bidCooldownSeconds ?? 0}s
            </Badge>
            <Badge variant="outline" className="px-1.5 py-0 font-normal">
              Max ext. {auction?.maxExtensionCount ?? 0}
            </Badge>
          </div>
        </div>

        {showPlaceBid ? (
          <div className="space-y-1.5">
            <Input
              inputMode="decimal"
              placeholder={
                nextBidMin != null
                  ? `Amount ≥ ${nextBidMin}`
                  : 'Enter bid amount'
              }
              value={bidAmount}
              onChange={(e) => onBidAmountChange(e.target.value)}
              disabled={inputDisabled}
              className="h-9 rounded-md border-border/80 bg-background text-xs tabular-nums"
            />
            <PlaceBidButton
              disabled={bidInvalid}
              cooldownRemainingSeconds={cooldownRemainingSeconds}
              pending={placingBid}
              onClick={onSubmitBid}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
