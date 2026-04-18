'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <Card className="rounded-xl border-border/50 bg-card/30 shadow-none">
      <CardHeader className="px-2.5 py-1.5 pb-0">
        <CardTitle className="text-[10px] font-semibold">
          Fallback public responses
        </CardTitle>
        <CardDescription className="text-[9px] leading-tight">
          Pending vs rejected participants (public offer round).
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2.5 pb-2 pt-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[140px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={4} maxBarSize={48}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
