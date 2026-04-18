import { Gavel, Handshake, Sparkles } from 'lucide-react';

import { getLatestAuctionsAction } from '@/actions/auction/auction.actions';
import { getProfileAction } from '@/actions/user/profile.actions';
import { getUserHomeStatsAction } from '@/actions/user/home.actions';
import { getMyAuctionsAction } from '@/actions/user/my-auctions.actions';
import { HomeAuctionsGrid } from '@/features/user/home/components/home-auctions-grid';
import { HomeEmptyState } from '@/features/user/home/components/home-empty-state';
import { HomeHero } from '@/features/user/home/components/home-hero';
import { HomeSection } from '@/features/user/home/components/home-section';
import { HomeStats } from '@/features/user/home/components/home-stats';
import type { IUserHomeStats } from '@/features/user/home/types/home.types';

const FEATURED_LIMIT = 10;
const PARTICIPATED_LIMIT = 5;

const EMPTY_STATS: IUserHomeStats = {
  liveCount: 0,
  upcomingCount: 0,
  endedCount: 0,
  participatedCount: 0,
};

export default async function HomePage() {
  const [profileRes, statsRes, participatedRes, featuredRes] =
    await Promise.all([
      getProfileAction(),
      getUserHomeStatsAction(),
      getMyAuctionsAction({ limit: PARTICIPATED_LIMIT }),
      getLatestAuctionsAction(FEATURED_LIMIT),
    ]);

  const profile = profileRes.success ? profileRes.data : null;
  const stats = statsRes.success && statsRes.data ? statsRes.data : EMPTY_STATS;
  const participated =
    participatedRes.success && participatedRes.data
      ? participatedRes.data.auctions
      : [];
  const featured =
    featuredRes.success && featuredRes.data ? featuredRes.data.auctions : [];

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:px-4 sm:py-5">
      <HomeHero
        name={profile?.name}
        avatarUrl={profile?.avatar_url || undefined}
        isVerified={profile?.isVerified}
      />

      <HomeStats stats={stats} />

      <HomeSection
        icon={Sparkles}
        title="Featured auctions"
        description="A curated mix of live, upcoming, and recently closed lots."
        linkHref="/auctions"
        linkLabel="View all"
      >
        <HomeAuctionsGrid
          auctions={featured}
          limit={FEATURED_LIMIT}
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
        description="Auctions you have joined, across all statuses."
        linkHref="/profile/my-auctions"
        linkLabel="View all"
      >
        <HomeAuctionsGrid
          auctions={participated}
          limit={PARTICIPATED_LIMIT}
          empty={
            <HomeEmptyState
              icon={Handshake}
              title="You haven't joined any auction yet"
              description="Browse featured auctions above and place your first bid to see them here."
              actionHref="/auctions"
              actionLabel="Browse auctions"
            />
          }
        />
      </HomeSection>
    </div>
  );
}
