import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const GRID =
  'grid w-full grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5';

export function AuctionListingGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(GRID, className)}>{children}</div>;
}
