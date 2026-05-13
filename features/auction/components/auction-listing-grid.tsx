import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const VARIANTS = {
  default:
    'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  home: 'grid w-full grid-cols-1 gap-4 sm:grid-cols-2',
  /** Home page hero grid — uses full content width */
  homeWide:
    'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  browse:
    'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

export type AuctionListingGridVariant = keyof typeof VARIANTS;

export function AuctionListingGrid({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: AuctionListingGridVariant;
}) {
  return <div className={cn(VARIANTS[variant], className)}>{children}</div>;
}
