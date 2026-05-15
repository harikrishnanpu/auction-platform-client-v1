'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SellerAuctionsPaginationVariant = 'panel' | 'minimal-end';

interface SellerAuctionsPaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  /** panel: full-width bar with border. minimal-end: plain, right-aligned (browse). */
  variant?: SellerAuctionsPaginationVariant;
}

export function SellerAuctionsPagination({
  currentPage,
  totalPages,
  loading,
  onPrev,
  onNext,
  className,
  variant = 'panel',
}: SellerAuctionsPaginationProps) {
  const canGoPrev = currentPage > 1 && !loading;
  const canGoNext = currentPage < totalPages && !loading;

  const prevBtn = (
    <Button
      variant="outline"
      size="sm"
      className="h-7 rounded-md px-2 text-[11px]"
      disabled={!canGoPrev}
      onClick={onPrev}
    >
      <ChevronLeft className="size-3.5" />
      Prev
    </Button>
  );

  const nextBtn = (
    <Button
      variant="outline"
      size="sm"
      className="h-7 rounded-md px-2 text-[11px]"
      disabled={!canGoNext}
      onClick={onNext}
    >
      Next
      <ChevronRight className="size-3.5" />
    </Button>
  );

  const pageLabel = (
    <span className="tabular-nums text-[11px] text-muted-foreground">
      Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
      <span className="font-medium text-foreground">{totalPages}</span>
    </span>
  );

  if (variant === 'minimal-end') {
    return (
      <div className={cn('flex justify-end', className)}>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {pageLabel}
          <div className="flex items-center gap-1">
            {prevBtn}
            {nextBtn}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-md border border-border/50 bg-muted/20 px-2 py-1.5',
        className
      )}
    >
      {prevBtn}
      {pageLabel}
      {nextBtn}
    </div>
  );
}
