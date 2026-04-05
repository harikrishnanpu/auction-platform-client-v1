import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  getSellerAuctionByIdAction,
  publishSellerAuctionAction,
} from '@/actions/auction/auction.actions';
import { Button } from '@/components/ui/button';
import { SellerAuctionDetailView } from '@/features/seller/auction/components/seller-auction-detail-view';
import { Badge } from '@/components/ui/badge';

export default async function SellerAuctionDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await getSellerAuctionByIdAction(id);

  if (!res.success || !res.data) return null;

  if (res.data.status !== 'DRAFT') {
    redirect(`/seller/auctions/${id}`);
  }

  // Render publish as a simple form action (server action).
  async function publishAction() {
    'use server';
    await publishSellerAuctionAction(id);
    redirect(`/seller/auctions/${id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">
              Draft auction
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">DRAFT</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/seller/auction/${id}/edit`}>Edit</Link>
            </Button>

            {/* Server action form avoids client-side RPC complexity */}
            <form action={publishAction}>
              <Button type="submit" size="sm">
                Publish draft
              </Button>
            </form>
          </div>
        </div>

        <SellerAuctionDetailView auction={res.data} />
      </div>
    </div>
  );
}
