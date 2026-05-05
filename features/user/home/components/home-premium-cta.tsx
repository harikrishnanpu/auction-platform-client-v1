import Link from 'next/link';
import { Crown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HomePremiumCta({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[12px] bg-[#101010] p-4 text-[#a1a1aa]',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <Crown className="size-5 shrink-0 text-[#fafafa]" aria-hidden />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Premium
          </h2>
          <p className="mt-1 text-xs leading-relaxed">
            Lower fees, priority placement, and seller tools built for power
            users.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="mt-4 h-9 w-full rounded-[8px] bg-white text-sm font-semibold text-[#111111] hover:bg-white/90"
      >
        <Link href="/profile/subscription">View plans</Link>
      </Button>
    </section>
  );
}
