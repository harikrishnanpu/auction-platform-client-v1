'use client';

import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export interface AdminDashboardSeriesPoint {
  label: string;
  count: number;
}

interface AdminDashboardChartsProps {
  auctionSeries: AdminDashboardSeriesPoint[];
  userRoleSeries: AdminDashboardSeriesPoint[];
}

const FILLS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const;

const auctionConfig = {
  count: { label: 'Count', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const usersConfig = {
  count: { label: 'Count', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function Panel({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
      <header className="border-b border-border/50 px-5 py-4 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {kicker}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>
      <div className="min-h-[200px] flex-1 px-2 pb-4 pt-2 sm:px-4 sm:pb-5">
        {children}
      </div>
    </section>
  );
}

function HorizontalBars({
  data,
  config,
  emptyLabel,
}: {
  data: AdminDashboardSeriesPoint[];
  config: ChartConfig;
  emptyLabel: string;
}) {
  const total = data.reduce((a, b) => a + b.count, 0);
  const max = Math.max(1, ...data.map((d) => d.count));

  if (total === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/15 px-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[220px] w-full sm:h-[240px]">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 28, left: 4, bottom: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          className="stroke-border/50"
        />
        <XAxis type="number" hide domain={[0, max]} />
        <YAxis
          type="category"
          dataKey="label"
          width={88}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
        />
        <ChartTooltip
          cursor={{
            fill: 'color-mix(in oklch, var(--foreground) 5%, transparent)',
          }}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
          {data.map((_, i) => (
            <Cell key={i} fill={FILLS[i % FILLS.length]} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            className="fill-foreground text-xs font-medium tabular-nums"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function AdminDashboardCharts({
  auctionSeries,
  userRoleSeries,
}: AdminDashboardChartsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      <Panel
        kicker="Marketplace"
        title="Auction pipeline"
        description="Live, upcoming, and ended volumes — same buckets as the public browse experience."
      >
        <HorizontalBars
          data={auctionSeries}
          config={auctionConfig}
          emptyLabel="No auction counts yet. Once listings go live, bars appear here."
        />
      </Panel>
      <Panel
        kicker="Directory"
        title="Roles on the platform"
        description="How many accounts carry buyer, seller, or admin roles (membership can overlap)."
      >
        <HorizontalBars
          data={userRoleSeries}
          config={usersConfig}
          emptyLabel="No role counts returned. Check the admin stats API."
        />
      </Panel>
    </div>
  );
}
