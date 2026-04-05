'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SellerAuctionsPaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function SellerAuctionsPagination({
  currentPage,
  totalPages,
  loading,
  onPrev,
  onNext,
}: SellerAuctionsPaginationProps) {
  const canGoPrev = currentPage > 1 && !loading;
  const canGoNext = currentPage < totalPages && !loading;

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/10 p-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-lg text-xs"
        disabled={!canGoPrev}
        onClick={onPrev}
      >
        <ChevronLeft className="size-3.5" />
        Prev
      </Button>

      <div className="text-[11px] text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span>{' '}
        of <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-lg text-xs"
        disabled={!canGoNext}
        onClick={onNext}
      >
        Next
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}
