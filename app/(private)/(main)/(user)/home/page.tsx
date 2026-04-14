import Link from 'next/link';
import { ArrowRight, Flame, Gavel, Sparkles, Timer } from 'lucide-react';

import { getLatestAuctionsAction } from '@/actions/auction/auction.actions';
import { getProfileAction } from '@/actions/user/profile.actions';
import { AuctionCard } from '@/features/auction/components/auction-card';
import { AuctionListingGrid } from '@/features/auction/components/auction-listing-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function HomePage() {
  const [latestRes, profileRes] = await Promise.all([
    getLatestAuctionsAction(8),
    getProfileAction(),
  ]);

  console.log('profileRes', profileRes);

  const auctions =
    latestRes.success && latestRes.data ? latestRes.data.auctions : [];
  const userName = profileRes.success && profileRes.data?.name;

  const liveCount = 0;
  const upcomingCount = 0;
  const endedCount = 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:px-4">
      <section className="rounded-2xl border border-border/70 bg-linear-to-br from-blue-500/10 via-background to-purple-500/10 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="inline-flex items-center gap-1 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="size-3.5" />
              Personalized dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {userName}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Track active opportunities, discover fresh listings, and jump into
              live bidding faster from your home dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-lg">
              <Link href="/auctions">
                Explore auctions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/profile">View profile</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Flame className="size-4 text-red-500" />
              Live now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{liveCount}</p>
            <p className="text-xs text-muted-foreground">
              Auctions taking bids right now
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Timer className="size-4 text-blue-500" />
              Starting soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcomingCount}</p>
            <p className="text-xs text-muted-foreground">
              Upcoming listings to watch
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Gavel className="size-4 text-emerald-500" />
              Recently closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{endedCount}</p>
            <p className="text-xs text-muted-foreground">
              Closed auctions in latest feed
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/70 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Featured auctions
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Curated mix of live, upcoming, and recently closed lots.
            </p>
          </div>

          <Button asChild variant="outline" className="h-8 rounded-lg text-xs">
            <Link href="/auctions">View all auctions</Link>
          </Button>
        </div>

        <AuctionListingGrid className="mt-4">
          {auctions.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
              No auctions available right now. Please check again shortly.
            </div>
          ) : (
            auctions.map((a) => (
              <AuctionCard key={a.id} auction={a} href={`/auction/${a.id}`} />
            ))
          )}
        </AuctionListingGrid>
      </section>
    </div>
  );
}
