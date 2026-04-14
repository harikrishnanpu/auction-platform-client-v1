import { Skeleton } from '@/components/ui/skeleton';
import { AuctionCardSkeleton } from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';

export function SellerHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-3 w-48 rounded-md" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}

export function SellerAuctionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <AuctionListingGrid>
      {Array.from({ length: count }).map((_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </AuctionListingGrid>
  );
}

export function SellerListingSectionSkeleton() {
  return (
    <div className="rounded-lg border border-border/70 bg-card/30">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-40 rounded-md" />
        </div>
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
      <div className="p-3">
        <SellerAuctionListSkeleton count={5} />
      </div>
    </div>
  );
}

export function SellerShellSkeleton() {
  return (
    <div className="min-h-[50vh] bg-background">
      <div className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4">
        <SellerHeaderSkeleton />
        <SellerListingSectionSkeleton />
      </div>
    </div>
  );
}
