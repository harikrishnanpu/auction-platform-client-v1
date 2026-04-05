'use client';

import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '../types/payments.types';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === 'COMPLETED') {
    return (
      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
        Paid
      </Badge>
    );
  }

  if (status === 'FAILED') {
    return <Badge variant="destructive">Failed</Badge>;
  }

  if (status === 'DECLINED') {
    return (
      <Badge
        variant="outline"
        className="border-amber-600/60 text-amber-800 dark:text-amber-200"
      >
        Declined
      </Badge>
    );
  }

  return <Badge variant="secondary">Pending</Badge>;
}
