import { redirect } from 'next/navigation';

import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { SellerAuctionDetailView } from '@/modules/seller/auction/components/seller-auction-detail-view';

export default async function SellerAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await getSellerAuctionByIdAction(id);

  if (!res.success || !res.data) return null;

  if (res.data.status === 'DRAFT') {
    redirect(`/seller/auction/${id}/draft`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-6">
        <SellerAuctionDetailView auction={res.data} />
      </div>
    </div>
  );
}
