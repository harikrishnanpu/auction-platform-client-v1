import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AdminBentoStatVariant = 'hero' | 'default' | 'accent';

export interface AdminBentoStatProps {
  label: string;
  value: number;
  caption?: string;
  icon: LucideIcon;
  variant?: AdminBentoStatVariant;
  className?: string;
}

/**
 * Stat cell for the admin overview bento — `hero` is the primary total-accounts tile.
 */
export function AdminBentoStat({
  label,
  value,
  caption,
  icon: Icon,
  variant = 'default',
  className,
}: AdminBentoStatProps) {
  if (variant === 'hero') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5',
          className
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 size-36 rounded-full bg-primary/7 blur-2xl dark:bg-primary/12"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </p>
            {caption ? (
              <p className="text-xs leading-snug text-muted-foreground sm:text-[13px] sm:leading-snug">
                {caption}
              </p>
            ) : null}
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/35 sm:size-10">
            <Icon
              className="size-[18px] text-foreground sm:size-5"
              aria-hidden
            />
          </span>
        </div>
        <p className="relative mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:mt-4 sm:text-4xl">
          {value}
        </p>
      </div>
    );
  }

  if (variant === 'accent') {
    return (
      <div
        className={cn(
          'flex flex-col rounded-2xl border border-primary/20 bg-primary/7 p-3.5 shadow-sm dark:bg-primary/11 sm:p-4',
          className
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {label}
          </p>
          <Icon
            className="size-3.5 shrink-0 text-primary opacity-90"
            aria-hidden
          />
        </div>
        <p className="mt-2 text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
          {value}
        </p>
        {caption ? (
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
            {caption}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-sm backdrop-blur-sm sm:p-4',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 sm:size-9">
          <Icon className="size-3.5 text-foreground/90 sm:size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
        {value}
      </p>
      {caption ? (
        <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
