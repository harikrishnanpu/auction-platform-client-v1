import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function ParticipationPill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border/80 bg-background/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  );
}
