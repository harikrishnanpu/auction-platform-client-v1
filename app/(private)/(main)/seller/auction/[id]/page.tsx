'use client';

import { use } from 'react';
import { ComingSoon } from '@/components/coming-soon';

export default function SellerAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  if (!id) return null;
  return (
    <ComingSoon
      title="No content"
      description={`Seller auction ${id} page is coming soon.`}
      homeHref="/seller/dashboard"
    />
  );
}
