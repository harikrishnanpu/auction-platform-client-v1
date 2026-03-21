import { redirect } from 'next/navigation';

import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { AuctionRoom } from '@/modules/auction-room/components/AuctionRoom';

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
    <div className="bg-background">
      <AuctionRoom auctionId={id} mode="SELLER" initialAuction={res.data} />
    </div>
  );
}
