'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatInr } from '@/utils/format-inr';

export interface SellerEarningsPoint {
  label: string;
  amount: number;
}

interface SellerEarningsChartProps {
  data: SellerEarningsPoint[];
}

export function SellerEarningsChart({ data }: SellerEarningsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          className="stroke-border"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={48}
          tickFormatter={(v) =>
            v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)
          }
        />
        <Tooltip
          formatter={(value) => formatInr(Number(value))}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--card)',
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2563EB"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#2563EB' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
