'use client';

import { use } from 'react';
import { ComingSoon } from '@/components/coming-soon';

export default function UserAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  if (!id) return null;
  return (
    <ComingSoon
      title="No content"
      description={`Auction ${id} details are coming soon.`}
      homeHref="/"
    />
  );
}
