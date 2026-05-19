import { cn } from '@/lib/utils';

/** Shared dashboard / browse UI scale — slightly compact for responsive layouts */
export function appCard(className?: string) {
  return cn('rounded-xl border border-border bg-card p-4 shadow-sm', className);
}

export function appInset(className?: string) {
  return cn('rounded-lg bg-muted/40 p-3', className);
}

export const appStack = 'space-y-4';
export const appGridGap = 'gap-4';
