import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HomeEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function HomeEmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: HomeEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/10 px-5 py-7 text-center',
        className
      )}
    >
      {Icon ? (
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <Icon className="size-5" />
        </div>
      ) : null}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[12px] text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <Button asChild size="sm" className="mt-4 rounded-lg">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
