import type { LucideIcon } from 'lucide-react';

import { appCard, appIconBadge } from '@/lib/app-design';
import { cn } from '@/lib/utils';

interface SellerMetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}

export function SellerMetricCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: SellerMetricCardProps) {
  return (
    <div className={cn(appCard(), className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <span className={appIconBadge('size-10 shrink-0 rounded-xl')}>
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </div>
  );
}
