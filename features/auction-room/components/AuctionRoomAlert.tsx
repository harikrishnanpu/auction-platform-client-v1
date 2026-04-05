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
        'flex gap-3 rounded-2xl border px-4 py-3 text-sm',
        variant === 'destructive' &&
          'border-destructive/30 bg-destructive/10 text-destructive',
        variant === 'warning' &&
          'border-amber-500/35 bg-amber-500/10 text-amber-950 dark:text-amber-100',
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
