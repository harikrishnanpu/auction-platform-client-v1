import Link from 'next/link';
import {
  ArrowRight,
  Car,
  Gavel,
  Heart,
  Palette,
  Radio,
  Smartphone,
  Users,
  Watch,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { appCard } from '@/lib/app-design';
import type { IUserHomeStats } from '@/features/user/home/types/home.types';
import type { IAuctionDto } from '@/types/auction.type';

import { HomeAuctionListRow } from './home-auction-list-row';
import { HomeHeroCarousel } from './home-hero-carousel';

interface HomeDashboardViewProps {
  stats: IUserHomeStats;
  liveAuctions: IAuctionDto[];
  longAndSealedAuctions: IAuctionDto[];
}

const TOP_CATEGORIES = [
  { label: 'Vehicles', icon: Car, href: '/auctions' },
  { label: 'Watches', icon: Watch, href: '/auctions' },
  { label: 'Art & Paintings', icon: Palette, href: '/auctions' },
  { label: 'Electronics', icon: Smartphone, href: '/auctions' },
  { label: 'Jewelry', icon: Zap, href: '/auctions' },
] as const;

export function HomeDashboardView({
  stats,
  liveAuctions,
  longAndSealedAuctions,
}: HomeDashboardViewProps) {
  const activeBids = stats.liveWinningCount + stats.liveLosingCount;
  const watching = Math.max(0, stats.liveCount);

  return (
    <div className="app-stack">
      <div className="grid app-grid-gap lg:grid-cols-[1.45fr_1fr]">
        <HomeHeroCarousel />

        <div className={appCard()}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="size-4 text-brand-600" />
              <h3 className="app-section-title">Your Auctions</h3>
            </div>
            <Link href="/profile/my-auctions" className="app-link">
              View All
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="app-inset">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-3.5" />
                <span className="text-[11px] font-medium">
                  Participated Auctions
                </span>
              </div>
              <p className="app-stat-value mt-1.5">{stats.participatedCount}</p>
            </div>
            <div className="app-inset">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Radio className="size-3.5" />
                <span className="text-[11px] font-medium">Active Bids</span>
              </div>
              <p className="app-stat-value mt-1.5">{activeBids}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-[13px] text-muted-foreground">
            <Heart className="size-3.5 text-brand-600" />
            <span>
              Watching ·{' '}
              <span className="font-semibold text-foreground">
                {watching} items
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid app-grid-gap lg:grid-cols-2">
        <div className={appCard()}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="app-section-title">Latest Live Auctions</h3>
            <Link href="/auctions" className="app-link">
              View All
            </Link>
          </div>
          <div className="space-y-0.5">
            {liveAuctions.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">
                No live auctions right now.
              </p>
            ) : (
              liveAuctions
                .slice(0, 4)
                .map((a) => (
                  <HomeAuctionListRow key={a.id} auction={a} variant="live" />
                ))
            )}
          </div>
        </div>

        <div className={appCard()}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="app-section-title">
              Latest Long / Sealed Bid Auctions
            </h3>
            <Link href="/auctions" className="app-link">
              View All
            </Link>
          </div>
          <div className="space-y-0.5">
            {longAndSealedAuctions.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">
                No long or sealed lots yet.
              </p>
            ) : (
              longAndSealedAuctions
                .slice(0, 4)
                .map((a) => (
                  <HomeAuctionListRow key={a.id} auction={a} variant="sealed" />
                ))
            )}
          </div>
        </div>
      </div>

      <div className="grid app-grid-gap lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-brand-600 p-5 text-white shadow-sm sm:p-6">
          <div className="relative z-10 max-w-sm">
            <h3 className="text-lg font-bold sm:text-xl">
              Never Miss Your Dream Item
            </h3>
            <p className="mt-1.5 text-[13px] text-brand-100">
              Add items to your wishlist and we&apos;ll notify you when
              they&apos;re live!
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 rounded-full bg-white text-brand-600 hover:bg-brand-50"
              disabled
            >
              Coming Soon
            </Button>
          </div>
          <div className="pointer-events-none absolute -right-8 bottom-0 size-32 rounded-full bg-white/15 blur-2xl" />
        </div>

        <div className={appCard()}>
          <h3 className="app-section-title">Top Categories</h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Explore popular auction categories
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {TOP_CATEGORIES.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50">
                  <Icon className="size-4" />
                </span>
                <span className="max-w-[68px] text-[11px] font-medium text-muted-foreground">
                  {label}
                </span>
              </Link>
            ))}
            <Link
              href="/auctions"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
              aria-label="View all categories"
            >
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
