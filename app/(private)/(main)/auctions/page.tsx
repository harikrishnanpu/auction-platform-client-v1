import { UserAuctionListView } from '@/modules/user/auction/list/components/user-auction-list-view';

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
      <UserAuctionListView />
    </div>
  );
}
