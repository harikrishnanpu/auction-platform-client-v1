'use client';

import { Trophy } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AuctionSoldSummaryCardProps = {
  winnerUserName: string;
  soldAmount: number;
};

function formatSoldAmount(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AuctionSoldSummaryCard({
  winnerUserName,
  soldAmount,
}: AuctionSoldSummaryCardProps) {
  return (
    <Card className="rounded-lg border-emerald-500/30 bg-emerald-500/5 shadow-sm">
      <CardHeader className="px-3 py-2 pb-1">
        <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
          <Trophy className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          Auction sold
        </CardTitle>
        <CardDescription className="text-[10px] leading-tight">
          Winning bidder and final price.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 px-3 pb-3 text-xs">
        <p>
          <span className="text-muted-foreground">Winner: </span>
          <span className="font-medium text-foreground">{winnerUserName}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Sold price: </span>
          <span className="font-semibold tabular-nums text-foreground">
            {formatSoldAmount(soldAmount)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
