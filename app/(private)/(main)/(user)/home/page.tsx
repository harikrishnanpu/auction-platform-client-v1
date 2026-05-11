import { Gavel, Handshake, Sparkles } from 'lucide-react';

import { getLatestAuctionsAction } from '@/actions/auction/auction.actions';
import { getProfileAction } from '@/actions/user/profile.actions';
import { getUserHomeStatsAction } from '@/actions/user/home.actions';
import { getMyAuctionsAction } from '@/actions/user/my-auctions.actions';
import { HomeAuctionsGrid } from '@/features/user/home/components/home-auctions-grid';
import { HomeEmptyState } from '@/features/user/home/components/home-empty-state';
import { HomeFooterLinksCard } from '@/features/user/home/components/home-footer-links-card';
import { HomeLeftRail } from '@/features/user/home/components/home-left-rail';
import { HomeParticipatedCards } from '@/features/user/home/components/home-participated-cards';
import { HomeParticipatedRail } from '@/features/user/home/components/home-participated-rail';
import { HomePremiumCta } from '@/features/user/home/components/home-premium-cta';
import { HomeSection } from '@/features/user/home/components/home-section';
import { HomeTopBar } from '@/features/user/home/components/home-top-bar';
import { HomeWishlistPlaceholder } from '@/features/user/home/components/home-wishlist-placeholder';
import type { IUserHomeStats } from '@/features/user/home/types/home.types';

const FEATURED_LIMIT = 10;
/** Enough rows for the rail (5) and the “below feed” strip (6) from one payload */
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
    <div className="mx-auto max-w-[1200px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[220px_1fr_280px] lg:items-start lg:gap-8">
        <div className="order-2 lg:order-1">
          <div className="lg:fixed lg:top-26 lg:z-20 lg:w-[220px] lg:max-h-[calc(100dvh-4rem)] lg:overflow-hidden lg:left-[max(1rem,calc((100vw-1200px)/2+1rem))]">
            <HomeLeftRail />
          </div>
        </div>

        <div className="order-1 min-w-0 space-y-6 lg:order-2">
          <HomeTopBar
            name={profile?.name}
            avatarUrl={profile?.avatar_url || undefined}
            isVerified={profile?.isVerified}
            planSummary={planSummary}
            stats={stats}
          />

          <HomeSection
            icon={Sparkles}
            title="Ending soon"
            description="Live auctions closing soonest — bid before the timer hits zero."
            linkHref="/auctions"
            linkLabel="View all"
          >
            <HomeAuctionsGrid
              auctions={featured}
              limit={FEATURED_LIMIT}
              gridVariant="home"
              empty={
                <HomeEmptyState
                  icon={Gavel}
                  title="No auctions available right now"
                  description="Please check again shortly for fresh listings."
                  actionHref="/auctions"
                  actionLabel="Refresh"
                />
              }
            />
          </HomeSection>

          <HomeSection
            icon={Handshake}
            title="Your participated auctions"
            description="Where you’ve joined — two columns with your standing on each card."
            linkHref="/profile/my-auctions"
            linkLabel="View all"
          >
            <HomeParticipatedCards
              auctions={belowFeedAuctions}
              limit={BELOW_FEED_VISIBLE}
              empty={
                <HomeEmptyState
                  icon={Handshake}
                  title="You haven’t joined any auction yet"
                  description="Browse the feed above and place a bid — your lots will show here with Win / Outbid status."
                  actionHref="/auctions"
                  actionLabel="Browse auctions"
                />
              }
            />
          </HomeSection>
        </div>

        {/* Right: same window scroll; sticky under header so feed can scroll past after rail ends */}
        <div className="order-3 flex min-w-0 flex-col gap-4 z-10 lg:sticky lg:top-16 lg:self-start">
          <HomeParticipatedRail
            auctions={railAuctions}
            totalJoined={participatedTotal}
          />
          <HomeWishlistPlaceholder />
          <HomePremiumCta />
          <HomeFooterLinksCard />
        </div>
      </div>
    </div>
  );
}
