'use client';

import { Badge } from '@/components/ui/badge';
import { AuctionCategoryStatus } from '@/types/auction.type';

export function AuctionCategoryStatusBadge({
  status,
}: {
  status: AuctionCategoryStatus;
}) {
  if (status === AuctionCategoryStatus.APPROVED) {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
        Approved
      </Badge>
    );
  }
  if (status === AuctionCategoryStatus.REJECTED) {
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    >
      Pending
    </Badge>
  );
}

export function YesNoBadge({
  value,
  yesLabel = 'Yes',
  noLabel = 'No',
}: {
  value: boolean;
  yesLabel?: string;
  noLabel?: string;
}) {
  return value ? (
    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
      {yesLabel}
    </Badge>
  ) : (
    <Badge variant="secondary">{noLabel}</Badge>
  );
}
