'use client';

import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export interface SellerDashboardSeriesPoint {
  label: string;
  count: number;
}

interface SellerDashboardChartsProps {
  auctionSeries: SellerDashboardSeriesPoint[];
  paymentSeries: SellerDashboardSeriesPoint[];
}

/** Theme tokens from globals.css — valid in SVG fills (unlike `hsl(var(--primary))` with oklch). */
const SERIES_FILLS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const;

const auctionChartConfig = {
  count: { label: 'Auctions', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const paymentChartConfig = {
  count: { label: 'Payments', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function SellerDashboardCharts({
  auctionSeries,
  paymentSeries,
}: SellerDashboardChartsProps) {
  const auctionMax = Math.max(1, ...auctionSeries.map((d) => d.count));
  const paymentMax = Math.max(1, ...paymentSeries.map((d) => d.count));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Auctions by status"
        description="How your listings are distributed across lifecycle states."
      >
        <ChartContainer
          config={auctionChartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart
            data={auctionSeries}
            margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={36}
              allowDecimals={false}
              domain={[0, auctionMax]}
            />
            <ChartTooltip
              cursor={{
                fill: 'color-mix(in oklch, var(--foreground) 6%, transparent)',
              }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {auctionSeries.map((_, i) => (
                <Cell
                  key={`a-${i}`}
                  fill={SERIES_FILLS[i % SERIES_FILLS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Buyer payments by status"
        description="Payment requests tied to your auctions."
      >
        <ChartContainer
          config={paymentChartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart
            data={paymentSeries}
            margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={36}
              allowDecimals={false}
              domain={[0, paymentMax]}
            />
            <ChartTooltip
              cursor={{
                fill: 'color-mix(in oklch, var(--foreground) 6%, transparent)',
              }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {paymentSeries.map((_, i) => (
                <Cell
                  key={`p-${i}`}
                  fill={SERIES_FILLS[(i + 2) % SERIES_FILLS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
}
