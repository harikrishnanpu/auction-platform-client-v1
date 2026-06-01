import Link from 'next/link';
import {
  ArrowRight,
  Car,
  Gavel,
  Palette,
  Radio,
  Smartphone,
  Users,
  Watch,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  appCard,
  appCardPromo,
  appGridGap,
  appIconBadge,
  appStack,
  appStatTile,
} from '@/lib/app-design';
import { cn } from '@/lib/utils';
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
  { label: 'Art', icon: Palette, href: '/auctions' },
  { label: 'Electronics', icon: Smartphone, href: '/auctions' },
  { label: 'Jewelry', icon: Zap, href: '/auctions' },
] as const;

function SectionHeader({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon?: typeof Gavel;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <span className={appIconBadge('size-8')}>
            <Icon className="size-4" />
          </span>
        ) : null}
        <h3 className="app-section-title">{title}</h3>
      </div>
      {href ? (
        <Link href={href} className="app-link inline-flex items-center gap-1">
          View All
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function HomeDashboardView({
  stats,
  liveAuctions,
  longAndSealedAuctions,
}: HomeDashboardViewProps) {
  const activeBids = stats.liveWinningCount + stats.liveLosingCount;

  return (
    <div className={appStack}>
      <div className={cn('grid', appGridGap, 'lg:grid-cols-[1.55fr_1fr]')}>
        <HomeHeroCarousel />

        <div className={appCard()}>
          <SectionHeader
            title="Your Auctions"
            icon={Gavel}
            href="/profile/my-auctions"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={appStatTile()}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4 shrink-0 text-primary/80" />
                <span className="text-xs font-medium">Participated</span>
              </div>
              <p className="app-stat-value mt-2">{stats.participatedCount}</p>
            </div>
            <div className={appStatTile()}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Radio className="size-4 shrink-0 text-primary/80" />
                <span className="text-xs font-medium">Active Bids</span>
              </div>
              <p className="app-stat-value mt-2">{activeBids}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('grid', appGridGap, 'lg:grid-cols-2')}>
        <div className={appCard()}>
          <SectionHeader title="Latest Live Auctions" href="/auctions" />
          <div className="divide-y divide-border/40">
            {liveAuctions.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
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
          <SectionHeader title="Long & Sealed Auctions" href="/auctions" />
          <div className="divide-y divide-border/40">
            {longAndSealedAuctions.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
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

      <div className={cn('grid', appGridGap, 'lg:grid-cols-2')}>
        <div className={appCardPromo()}>
          <div className="relative z-10 max-w-sm">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              Never Miss Your Dream Item
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Add items to your wishlist and get notified when they go live.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-5 rounded-full bg-card px-5 font-semibold text-primary shadow-sm hover:bg-card/90"
              disabled
            >
              Coming Soon
            </Button>
          </div>
          <div className="pointer-events-none absolute -right-6 bottom-0 size-36 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className={appCard()}>
          <h3 className="app-section-title">Top Categories</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore popular auction categories
          </p>
          <div className="mt-6 flex flex-wrap items-start gap-5 sm:gap-6">
            {TOP_CATEGORIES.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-2.5 text-center transition-transform hover:-translate-y-1"
              >
                <span
                  className={appIconBadge(
                    'size-14 transition-shadow group-hover:shadow-[var(--surface-shadow)]'
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="max-w-[72px] text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {label}
                </span>
              </Link>
            ))}
            <Link
              href="/auctions"
              className={cn(
                appIconBadge(
                  'size-10 text-muted-foreground hover:text-primary'
                ),
                'mt-2 transition-transform hover:-translate-y-0.5'
              )}
              aria-label="View all categories"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
