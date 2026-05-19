'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { formatInr } from '@/utils/format-inr';

export interface SellerPaymentSlice {
  name: string;
  value: number;
  color: string;
}

interface SellerPaymentsDonutProps {
  slices: SellerPaymentSlice[];
}

export function SellerPaymentsDonut({ slices }: SellerPaymentsDonutProps) {
  const total = slices.reduce((s, x) => s + x.value, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="mx-auto h-[180px] w-[180px] shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
            >
              {slices.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatInr(Number(v))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2 text-sm">
        {slices.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ background: s.color }}
              />
              {s.name}
            </span>
            <span className="font-semibold text-foreground">
              {formatInr(s.value)}
            </span>
          </li>
        ))}
        {total === 0 ? (
          <li className="text-xs text-muted-foreground">No payment data yet</li>
        ) : null}
      </ul>
    </div>
  );
}
