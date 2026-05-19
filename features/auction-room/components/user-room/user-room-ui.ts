import { cn } from '@/lib/utils';

export function urCard(className?: string) {
  return cn(
    'rounded-lg border border-border/80 bg-card p-3.5 shadow-sm sm:p-4',
    className
  );
}

export function urSectionTitle(className?: string) {
  return cn('text-sm font-semibold text-foreground', className);
}

export function urPage(className?: string) {
  return cn('min-w-0 text-[13px] leading-snug', className);
}
