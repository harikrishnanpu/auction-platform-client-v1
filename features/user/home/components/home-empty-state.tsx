import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { appEmptyState } from '@/lib/app-design';
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
    <div className={cn(appEmptyState(), 'px-5 py-7', className)}>
      {Icon ? (
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-[var(--surface-inset)] text-muted-foreground">
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
        <Link href={actionHref} className="mt-4 inline-block">
          <Button size="sm" className="rounded-full">
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
