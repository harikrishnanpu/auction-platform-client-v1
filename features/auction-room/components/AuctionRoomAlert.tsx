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
        'flex gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] leading-snug',
        variant === 'destructive' &&
          'border-destructive/25 bg-destructive/10 text-destructive',
        variant === 'warning' &&
          'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100',
        className
      )}
    >
      <AlertCircle className="mt-px size-3 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
