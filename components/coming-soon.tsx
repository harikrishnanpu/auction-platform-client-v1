'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function ComingSoon({
  title = 'Coming soon',
  description = 'This section is being rebuilt.',
  homeHref = '/',
}: {
  title?: string;
  description?: string;
  homeHref?: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-background/80 backdrop-blur p-6 text-center space-y-3">
        <div className="text-2xl font-extrabold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="pt-2 flex justify-center">
          <Button asChild variant="outline">
            <Link href={homeHref}>Go back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
