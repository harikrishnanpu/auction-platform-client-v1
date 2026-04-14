import Link from 'next/link';

import { getLatestAuctionsAction } from '@/actions/auction/auction.actions';
import { AuctionCard } from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const res = await getLatestAuctionsAction(5);

  const auctions = res.success && res.data ? res.data.auctions : [];

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Latest auctions
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Browse ACTIVE listings and place secure bids in real-time.
          </p>
        </div>

        <Button asChild variant="outline" className="h-8 rounded-lg text-xs">
          <Link href="/auctions">View all auctions</Link>
        </Button>
      </div>

      <AuctionListingGrid className="mt-4">
        {auctions.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
            No auctions available right now.
          </div>
        ) : (
          auctions.map((a) => (
            <AuctionCard key={a.id} auction={a} href={`/auction/${a.id}`} />
          ))
        )}
      </AuctionListingGrid>
    </div>
  );
}
