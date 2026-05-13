import { Gavel, Handshake, Sparkles } from 'lucide-react';

import { getLatestAuctionsAction } from '@/actions/auction/auction.actions';
import { getProfileAction } from '@/actions/user/profile.actions';
import { getUserHomeStatsAction } from '@/actions/user/home.actions';
import { getMyAuctionsAction } from '@/actions/user/my-auctions.actions';
import { HomeAuctionsGrid } from '@/features/user/home/components/home-auctions-grid';
import { HomeEmptyState } from '@/features/user/home/components/home-empty-state';
import { HomeFooterLinksCard } from '@/features/user/home/components/home-footer-links-card';
import { HomeParticipatedCards } from '@/features/user/home/components/home-participated-cards';
import { HomeParticipatedRail } from '@/features/user/home/components/home-participated-rail';
import { HomePremiumCta } from '@/features/user/home/components/home-premium-cta';
import { HomeQuickNav } from '@/features/user/home/components/home-quick-nav';
import { HomeSection } from '@/features/user/home/components/home-section';
import { HomeTopBar } from '@/features/user/home/components/home-top-bar';
import { HomeWalletLinkCard } from '@/features/user/home/components/home-wallet-link-card';
import { HomeWishlistPlaceholder } from '@/features/user/home/components/home-wishlist-placeholder';
import type { IUserHomeStats } from '@/features/user/home/types/home.types';

const FEATURED_LIMIT = 12;
const PARTICIPATED_FETCH_LIMIT = 8;
const RAIL_VISIBLE = 5;
const BELOW_FEED_VISIBLE = 6;

const EMPTY_STATS: IUserHomeStats = {
  liveCount: 0,
  upcomingCount: 0,
  endedCount: 0,
  participatedCount: 0,
  liveWinningCount: 0,
  liveLosingCount: 0,
  wonCount: 0,
  lostCount: 0,
};

export default async function HomePage() {
  const [profileRes, statsRes, participatedRes, featuredRes] =
    await Promise.all([
      getProfileAction(),
      getUserHomeStatsAction(),
      getMyAuctionsAction({
        limit: PARTICIPATED_FETCH_LIMIT,
        page: 1,
        sort: 'startAt',
        order: 'desc',
        status: 'ALL',
        auctionType: 'ALL',
      }),
      getLatestAuctionsAction(FEATURED_LIMIT),
    ]);

  const profile = profileRes.success ? profileRes.data : null;
  const apiStats =
    statsRes.success && statsRes.data
      ? { ...EMPTY_STATS, ...statsRes.data }
      : EMPTY_STATS;
  const participatedPayload =
    participatedRes.success && participatedRes.data
      ? participatedRes.data
      : null;

  const participatedAll = participatedPayload?.auctions ?? [];
  const participatedTotal =
    participatedPayload?.total ?? apiStats.participatedCount;

  const stats: IUserHomeStats = {
    ...apiStats,
    participatedCount: participatedTotal,
  };

  const featured =
    featuredRes.success && featuredRes.data ? featuredRes.data.auctions : [];

  const railAuctions = participatedAll.slice(0, RAIL_VISIBLE);
  const belowFeedAuctions = participatedAll.slice(0, BELOW_FEED_VISIBLE);

  const planSummary =
    profile?.subscription != null
      ? `${profile.subscription.planName} · ${profile.subscription.status}`
      : undefined;

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full">
      <div className="mx-auto w-full max-w-[min(100%,1600px)] px-5 py-6 sm:px-8 sm:py-7 md:px-10 lg:px-14 lg:py-8 xl:px-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(300px,24rem)]">
          {/* Main column: hero + feed (does not span full viewport width alone) */}
          <div className="min-w-0 space-y-8 lg:space-y-10">
            <HomeTopBar
              name={profile?.name}
              avatarUrl={profile?.avatar_url || undefined}
              isVerified={profile?.isVerified}
              planSummary={planSummary}
              stats={stats}
            />

            <HomeQuickNav />

            <HomeSection
              icon={Sparkles}
              title="Ending soon"
              description="Live listings closing soonest."
              linkHref="/auctions"
              linkLabel="View all"
            >
              <HomeAuctionsGrid
                auctions={featured}
                limit={FEATURED_LIMIT}
                gridVariant="homeWide"
                empty={
                  <HomeEmptyState
                    icon={Gavel}
                    title="No auctions right now"
                    description="Check back soon for new listings."
                    actionHref="/auctions"
                    actionLabel="Browse"
                  />
                }
              />
            </HomeSection>

            <HomeSection
              className="min-w-0"
              icon={Handshake}
              title="Your auctions"
              description="Lots you have joined — status on each card."
              linkHref="/profile/my-auctions"
              linkLabel="View all"
            >
              <HomeParticipatedCards
                auctions={belowFeedAuctions}
                limit={BELOW_FEED_VISIBLE}
                empty={
                  <HomeEmptyState
                    icon={Handshake}
                    title="No joined auctions yet"
                    description="Open any listing and place a bid to see it here."
                    actionHref="/auctions"
                    actionLabel="Browse auctions"
                  />
                }
              />
            </HomeSection>
          </div>

          {/* Right column: wallet, your auctions rail, then plans / wishlist / footer */}
          <aside className="flex w-full min-w-0 flex-col gap-4 lg:sticky lg:top-20 lg:self-start xl:gap-5">
            <HomeWalletLinkCard />
            <HomeParticipatedRail
              auctions={railAuctions}
              totalJoined={participatedTotal}
            />
            <HomePremiumCta />
            <HomeWishlistPlaceholder />
            <HomeFooterLinksCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
