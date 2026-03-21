'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PlaceBidButtonProps = {
  className?: string;
  /** When &gt; 0, button shows wait timer and is disabled. */
  cooldownRemainingSeconds: number;
  pending?: boolean;
  disabled: boolean;
  onClick: () => void;
};

export function PlaceBidButton({
  className,
  cooldownRemainingSeconds,
  pending,
  disabled,
  onClick,
}: PlaceBidButtonProps) {
  const inCooldown = cooldownRemainingSeconds > 0;
  const label = pending
    ? 'Placing…'
    : inCooldown
      ? `Wait ${cooldownRemainingSeconds}s`
      : 'Place bid';

  return (
    <Button
      type="button"
      size="sm"
      onClick={onClick}
      disabled={disabled || inCooldown || pending}
      className={cn(
        'h-9 w-full gap-2 rounded-md text-xs font-semibold shadow-sm',
        className
      )}
    >
      {pending ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
      ) : null}
      {label}
    </Button>
  );
}
