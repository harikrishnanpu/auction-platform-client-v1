import { redirect } from 'next/navigation';

import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { SellerAuctionRoomView } from '@/features/auction-room/views/SellerAuctionRoomView';

export default async function SellerAuctionsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await getSellerAuctionByIdAction(id);

  if (!res.success || !res.data) return null;

  if (res.data.status === 'DRAFT') {
    redirect(`/seller/auction/${id}/draft`);
  }

  return (
    <div className="bg-background">
      <SellerAuctionRoomView auctionId={id} initialAuction={res.data} />
    </div>
  );
}
