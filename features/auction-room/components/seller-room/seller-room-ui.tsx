import { cn } from '@/lib/utils';

/** Compact card tuned for 100% zoom / laptop viewports */
export function srCard(className?: string) {
  return cn(
    'rounded-lg border border-border/80 bg-card p-3.5 shadow-sm sm:p-4',
    className
  );
}

export function srSectionTitle(className?: string) {
  return cn('text-sm font-semibold text-foreground', className);
}

export function srPage(className?: string) {
  return cn('min-h-0 text-[13px] leading-snug', className);
}
