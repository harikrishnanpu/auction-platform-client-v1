import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import { DashboardView } from '@/modules/user/home/components/dashboard-view';

export default async function HomePage() {
  const auctions = await getBrowseAuctionsAction({});

  if (!auctions.success && !auctions.data) {
    return (
      <DashboardView
        auctions={[]}
        loading={false}
        error={auctions.error ?? null}
      />
    );
  }

  return (
    <DashboardView
      auctions={auctions.data?.auctions ?? []}
      loading={false}
      error={auctions.error ?? null}
    />
  );
}
