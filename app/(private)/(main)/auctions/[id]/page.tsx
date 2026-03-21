import { AuctionRoom } from '@/modules/auction-room/components/AuctionRoom';
import { redirect } from 'next/navigation';

import { authGetSesssion } from '@/actions/auth/auth.actions';
import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { UserRole } from '@/types/user.type';

export default async function UserAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

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
        redirect(`/seller/auction/${id}`);
      }
    }
  }

  return (
    <div className="bg-background">
      <AuctionRoom auctionId={id} mode="USER" />
    </div>
  );
}
