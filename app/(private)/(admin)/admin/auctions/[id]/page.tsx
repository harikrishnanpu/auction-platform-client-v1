import { AdminAuctionRoomView } from '@/modules/auction-room/views/AdminAuctionRoomView';

export default async function AdminAuctionRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="min-h-[60vh] bg-background">
      <AdminAuctionRoomView auctionId={id} />
    </div>
  );
}
