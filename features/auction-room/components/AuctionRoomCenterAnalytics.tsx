'use client';

import { useMemo } from 'react';
import { Activity, Crown, Gauge } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
} from '@/utils/auction-utils';

import type { IAuctionDto } from '@/types/auction.type';
import type {
  IAuctionRoomBid,
  IAuctionRoomCharts,
} from '@/types/auctionRoom.types';

import type { AuctionRoomMetricTile } from '../utils/auction-room-metrics';
import {
  bidsWithVisibleAmounts,
  buildBidVolumeBuckets,
  buildEmptyVolumeBuckets,
  getPeakBidFromFeed,
} from '../utils/auction-room-bid-analytics';
import {
  shouldRevealSealedWinningAmount,
  isSealedAuctionType,
} from '../utils/auction-room.utils';

import { arCardCanvas, arType } from '../lib/auction-room-design';
import { AuctionRoomStatTile } from './AuctionRoomStatTile';

const volumeConfig = {
  count: {
    label: 'Bids',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

const BUCKET_COUNT = 8;
const BUCKET_MINUTES = 15;

type AuctionRoomAnalyticsKpisProps = {
  metricTiles: AuctionRoomMetricTile[];
  showLivePulse: boolean;
  className?: string;
};

export function AuctionRoomAnalyticsKpis({
  metricTiles,
  showLivePulse,
  className,
}: AuctionRoomAnalyticsKpisProps) {
  return (
    <section className={cn(arCardCanvas('overflow-hidden'), className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-linear-to-r from-primary/6 via-transparent to-transparent px-2.5 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
            <Activity className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className={arType.cardTitle}>Auction analytics</h2>
            <p className={arType.cardDesc}>
              Participation, pacing, and engagement
            </p>
          </div>
        </div>
        {showLivePulse ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            <span
              className="size-1.5 animate-pulse rounded-full bg-emerald-500"
              aria-hidden
            />
            Live
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 lg:grid-cols-4">
        {metricTiles.map((tile) => (
          <AuctionRoomStatTile
            key={tile.key}
            label={tile.label}
            title={tile.hint}
            className="bg-muted/15 dark:bg-muted/10"
          >
            <p className="text-sm font-semibold tabular-nums tracking-tight">
              {tile.value}
            </p>
          </AuctionRoomStatTile>
        ))}
      </div>
    </section>
  );
}

type AuctionRoomAnalyticsChartsProps = {
  auction: IAuctionDto | null;
  liveFeed: IAuctionRoomBid[];
  charts: IAuctionRoomCharts | null | undefined;
  currentBidAmount: number | null;
  isAuctionEnded: boolean;
  className?: string;
};

export function AuctionRoomAnalyticsCharts({
  auction,
  liveFeed,
  charts,
  currentBidAmount,
  isAuctionEnded,
  className,
}: AuctionRoomAnalyticsChartsProps) {
  const isSealed = isSealedAuctionType(auction?.auctionType);
  const revealAmounts =
    !isSealed ||
    shouldRevealSealedWinningAmount(isAuctionEnded, currentBidAmount);

  const volumeBuckets = useMemo(() => {
    const fromServer = charts?.bidVolumeBuckets;
    if (fromServer?.length) return fromServer;
    if (liveFeed.length > 0) {
      return buildBidVolumeBuckets(liveFeed, BUCKET_COUNT, BUCKET_MINUTES);
    }
    return buildEmptyVolumeBuckets(BUCKET_COUNT, BUCKET_MINUTES);
  }, [charts?.bidVolumeBuckets, liveFeed]);

  const hasVolume = volumeBuckets.some((b) => b.count > 0);

  const peakMeta = useMemo(() => {
    if (!revealAmounts) return null;

    const serverPeak = charts?.peakBid;
    if (serverPeak) {
      return {
        peakAmount: serverPeak.amount,
        peakTimeLabel: formatAuctionDateTime(serverPeak.createdAt),
        paceNote: null as string | null,
      };
    }

    const plain = bidsWithVisibleAmounts(liveFeed, revealAmounts);
    if (!plain.length) return null;

    const { peakAt, peakAmount } = getPeakBidFromFeed(plain);
    if (!peakAt) return null;

    const sorted = [...plain].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const first = sorted[0];
    let paceNote: string | null = null;
    if (first && peakAt) {
      const diffMs =
        new Date(peakAt.createdAt).getTime() -
        new Date(first.createdAt).getTime();
      const mins = Math.round(diffMs / 60000);
      paceNote =
        mins < 1
          ? '< 1 min after opening bid'
          : `${mins} min after opening bid`;
    }

    return {
      peakAmount,
      peakTimeLabel: formatAuctionDateTime(peakAt.createdAt),
      paceNote,
    };
  }, [liveFeed, revealAmounts, charts?.peakBid]);

  return (
    <div
      className={cn('grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2', className)}
    >
      <section className={arCardCanvas('overflow-hidden')}>
        <div className="border-b border-border/80 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-amber-500/15 text-amber-800 dark:text-amber-300">
              <Crown className="size-3.5" aria-hidden />
            </span>
            <div>
              <h3 className={arType.cardTitle}>Highest bid timing</h3>
              <p className={arType.cardDesc}>When the lead last increased</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 px-2.5 py-2">
          {!revealAmounts && !isAuctionEnded ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sealed amounts and peak timing are revealed after the auction
              closes.
            </p>
          ) : null}
          {revealAmounts && peakMeta ? (
            <>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {formatAuctionPrice(peakMeta.peakAmount)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Recorded at{' '}
                <span className="font-medium text-foreground">
                  {peakMeta.peakTimeLabel}
                </span>
              </p>
              {peakMeta.paceNote ? (
                <p className="text-[10px] text-muted-foreground">
                  {peakMeta.paceNote}
                </p>
              ) : null}
            </>
          ) : null}
          {revealAmounts && !peakMeta ? (
            <p className="text-xs text-muted-foreground">
              No visible lead amount yet — updates when bids include amounts.
            </p>
          ) : null}
        </div>
      </section>

      <section className={arCardCanvas('overflow-hidden')}>
        <div className="border-b border-border/80 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-muted/60 text-foreground">
              <Gauge className="size-3.5" aria-hidden />
            </span>
            <div>
              <h3 className={arType.cardTitle}>Bid pacing</h3>
              <p className={arType.cardDesc}>
                Bids per {BUCKET_MINUTES}m bucket (last 2h)
              </p>
            </div>
          </div>
        </div>
        <div className="px-2 pb-2 pt-1">
          <ChartContainer
            config={volumeConfig}
            className="aspect-auto h-[160px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={volumeBuckets}
              margin={{ left: 4, right: 4, top: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                fontSize={9}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={44}
              />
              <YAxis
                allowDecimals={false}
                width={22}
                tickLine={false}
                axisLine={false}
                fontSize={10}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                opacity={hasVolume ? 1 : 0.45}
              />
            </BarChart>
          </ChartContainer>
          {!hasVolume ? (
            <p className="mt-0.5 px-1 text-[10px] text-muted-foreground">
              No bids in this window yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
