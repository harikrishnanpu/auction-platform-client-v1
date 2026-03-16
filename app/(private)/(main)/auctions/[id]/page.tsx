'use client';

import { use } from 'react';
// import { UserAuctionDetailView } from '@/modules/user/auction/detail/components/user-auction-detail-view';

export default function UserAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  if (!id) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
      {/* <UserAuctionDetailView auctionId={id} /> */}
    </div>
  );
}
