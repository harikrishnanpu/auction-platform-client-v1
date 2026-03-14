'use client';

import { use } from 'react';
import { SellerAuctionDetailView } from '@/modules/seller/auction/details/components/seller-auction-detail-view';

export default function SellerAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  if (!id) return null;
  return <SellerAuctionDetailView auctionId={id} />;
}
