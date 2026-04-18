import { redirect } from 'next/navigation';

import { authGetSesssion } from '@/actions/auth/auth.actions';
import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { UserAuctionRoomView } from '@/features/auction-room/views/UserAuctionRoomView';
import { UserRole } from '@/types/user.type';

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionRes = await authGetSesssion();
  if (sessionRes.success && sessionRes.data) {
    const authUser = sessionRes.data;
    const isSellerRole = authUser.roles?.includes(UserRole.SELLER) ?? false;

    if (isSellerRole) {
      const sellerAuctionRes = await getSellerAuctionByIdAction(id);
      if (
        sellerAuctionRes.success &&
        sellerAuctionRes.data &&
        sellerAuctionRes.data.sellerId === authUser.id
      ) {
        redirect(`/seller/auctions/${id}`);
      }
    }
  }

  return (
    <div className="bg-background">
      <UserAuctionRoomView auctionId={id} />
    </div>
  );
}
