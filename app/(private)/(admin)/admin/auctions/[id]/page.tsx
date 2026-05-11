import { AdminAuctionRoomView } from '@/features/auction-room/views/AdminAuctionRoomView';

export default async function AdminAuctionRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <AdminAuctionRoomView auctionId={id} />;
}
