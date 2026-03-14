import { SellerAuctionListView } from '@/modules/seller/auction/list/components/seller-auction-list-view';

export default function SellerAuctionListPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
      <SellerAuctionListView />
    </div>
  );
}
