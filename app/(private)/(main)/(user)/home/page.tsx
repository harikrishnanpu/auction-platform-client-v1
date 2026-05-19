import { getUserHomeAuctionFeedAction } from '@/actions/auction/auction.actions';
import { getUserHomeStatsAction } from '@/actions/user/home.actions';
import { getMyAuctionsAction } from '@/actions/user/my-auctions.actions';
import { HomeDashboardView } from '@/features/user/home/components/home-dashboard-view';
import type { IUserHomeStats } from '@/features/user/home/types/home.types';

const LIVE_HOME_LIMIT = 4;
const LONG_SEALED_HOME_LIMIT = 4;
const PARTICIPATED_FETCH_LIMIT = 8;

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
  const [statsRes, participatedRes, homeFeedRes] = await Promise.all([
    getUserHomeStatsAction(),
    getMyAuctionsAction({
      limit: PARTICIPATED_FETCH_LIMIT,
      page: 1,
      sort: 'startAt',
      order: 'desc',
      status: 'ALL',
      auctionType: 'ALL',
    }),
    getUserHomeAuctionFeedAction({
      liveLimit: LIVE_HOME_LIMIT,
      longSealedLimit: LONG_SEALED_HOME_LIMIT,
    }),
  ]);

  const apiStats =
    statsRes.success && statsRes.data
      ? { ...EMPTY_STATS, ...statsRes.data }
      : EMPTY_STATS;

  const participatedPayload =
    participatedRes.success && participatedRes.data
      ? participatedRes.data
      : null;

  const participatedTotal =
    participatedPayload?.total ?? apiStats.participatedCount;

  const stats: IUserHomeStats = {
    ...apiStats,
    participatedCount: participatedTotal,
  };

  const liveAuctions =
    homeFeedRes.success && homeFeedRes.data
      ? homeFeedRes.data.liveAuctions
      : [];
  const longAndSealedAuctions =
    homeFeedRes.success && homeFeedRes.data
      ? homeFeedRes.data.longAndSealedAuctions
      : [];

  return (
    <HomeDashboardView
      stats={stats}
      liveAuctions={liveAuctions}
      longAndSealedAuctions={longAndSealedAuctions}
    />
  );
}
