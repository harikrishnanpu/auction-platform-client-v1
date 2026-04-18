'use client';

import { Trophy } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="rounded-xl border-emerald-500/25 bg-emerald-500/[0.04] shadow-none">
      <CardHeader className="space-y-0 px-2.5 py-1.5 pb-0">
        <CardTitle className="flex items-center gap-1 text-[10px] font-semibold">
          <Trophy className="size-2.5 text-emerald-600 dark:text-emerald-400" />
          Sold
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5 px-2.5 pb-2 pt-1 text-[9px] leading-snug">
        <p>
          <span className="text-muted-foreground">Winner · </span>
          <span className="font-medium text-foreground">{winnerUserName}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Price · </span>
          <span className="font-semibold tabular-nums text-foreground">
            {formatSoldAmount(soldAmount)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
