'use client';

import { Trophy } from 'lucide-react';

import { arCardCanvas, arType } from '../lib/auction-room-design';

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
    <section
      className={arCardCanvas(
        'border-emerald-500/25 bg-emerald-500/[0.06] dark:bg-emerald-950/25'
      )}
    >
      <div className="flex items-start gap-2 px-3 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-emerald-600 text-white">
          <Trophy className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1.5">
          <div>
            <p className={arType.sectionLabel}>Sold</p>
            <p className="mt-0.5 text-sm font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
              <span className="tabular-nums">
                {formatSoldAmount(soldAmount)}
              </span>
            </p>
          </div>
          <p className="text-[11px] leading-snug text-foreground/90">
            <span className="font-medium text-foreground">
              {winnerUserName}
            </span>{' '}
            wins
          </p>
        </div>
      </div>
    </section>
  );
}
