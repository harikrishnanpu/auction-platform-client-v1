'use client';

import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type AuctionRoomAlertProps = {
  message: string;
  variant?: 'destructive' | 'warning';
  className?: string;
};

export function AuctionRoomAlert({
  message,
  variant = 'destructive',
  className,
}: AuctionRoomAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-[12px] border px-4 py-3 text-sm leading-relaxed',
        variant === 'destructive' &&
          'border-[#fecaca] bg-red-50 text-[#991b1b] dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200',
        variant === 'warning' &&
          'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100',
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 opacity-90" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
