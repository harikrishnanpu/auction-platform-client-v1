import { cn } from '@/lib/utils';

export function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'cat' | 'type' | 'cond' | 'default';
}) {
  return (
    <span
      className={cn(
        'rounded px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.05em] border',
        variant === 'cat' &&
          'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900/70',
        variant === 'type' &&
          'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
        variant === 'cond' &&
          'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-900/70',
        variant === 'default' &&
          'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:border-slate-700'
      )}
    >
      {children}
    </span>
  );
}
