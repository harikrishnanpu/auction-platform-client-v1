'use client';

import { Clock, Gavel } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuctionTypeBadge } from '@/components/auction/auction-type-badge';
import type { AuctionCountdownPhase } from '../hooks/use-auction-countdown';

export interface AuctionDetailBidPanelProps {
  title: string;
  category: string;
  condition: string;
  auctionType: string;
  startPrice: number;
  minIncrement: number;
  phase: AuctionCountdownPhase;
  countdownText: string;
  bidAmount: string;
  onBidAmountChange: (value: string) => void;
  minBid: number;
  step: number;
  onBidSubmit: (e: React.FormEvent) => void;
  startAt: Date;
}

export function AuctionDetailBidPanel({
  title,
  category,
  condition,
  auctionType,
  startPrice,
  minIncrement,
  phase,
  countdownText,
  bidAmount,
  onBidAmountChange,
  minBid,
  step,
  onBidSubmit,
  startAt,
}: AuctionDetailBidPanelProps) {
  const countdownColor =
    phase === 'ended'
      ? 'text-muted-foreground'
      : phase === 'live'
        ? 'text-green-600 dark:text-green-400'
        : 'text-amber-600 dark:text-amber-400';

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-lg font-serif font-semibold">{title}</h2>
          <AuctionTypeBadge auctionType={auctionType} />
        </div>
        <p className="text-sm text-muted-foreground">
          {category} • {condition}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Clock size={20} aria-hidden />
          <span className={countdownColor}>{countdownText}</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current price</p>
          <p className="text-2xl font-bold">₹ {startPrice.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Min increment ₹ {minIncrement.toLocaleString()}
          </p>
        </div>

        {phase === 'live' && (
          <form onSubmit={onBidSubmit} className="space-y-3 pt-2">
            <Label htmlFor="bidAmount">Your bid (₹)</Label>
            <Input
              id="bidAmount"
              type="number"
              min={minBid}
              step={step}
              value={bidAmount}
              onChange={(e) => onBidAmountChange(e.target.value)}
              aria-label="Bid amount"
            />
            <Button type="submit" className="w-full" size="lg">
              <Gavel size={16} className="mr-2" aria-hidden />
              Place bid
            </Button>
          </form>
        )}
        {phase === 'upcoming' && (
          <p className="text-sm text-muted-foreground">
            Bidding opens at {startAt.toLocaleString()}.
          </p>
        )}
        {phase === 'ended' && (
          <p className="text-sm text-muted-foreground">
            This auction has ended.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
