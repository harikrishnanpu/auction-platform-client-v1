'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import { arCardCanvas, arType } from '../lib/auction-room-design';

const chartConfig = {
  pending: {
    label: 'Pending',
    color: 'var(--chart-2)',
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

type FallbackPublicParticipantStatsCardProps = {
  pending: number;
  rejected: number;
};

export function FallbackPublicParticipantStatsCard({
  pending,
  rejected,
}: FallbackPublicParticipantStatsCardProps) {
  const data = [
    {
      label: 'Pending',
      key: 'pending',
      count: pending,
      fill: 'var(--color-pending)',
    },
    {
      label: 'Rejected',
      key: 'rejected',
      count: rejected,
      fill: 'var(--color-rejected)',
    },
  ];

  return (
    <section className={arCardCanvas('overflow-hidden')}>
      <div className="border-b border-border/80 px-2.5 py-2">
        <h3 className={arType.cardTitle}>Fallback responses</h3>
        <p className={arType.cardDesc}>
          Pending vs rejected bidders in the public-offer round.
        </p>
      </div>
      <div className="px-2.5 py-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[140px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              allowDecimals={false}
              width={36}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={6} maxBarSize={52}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  );
}
