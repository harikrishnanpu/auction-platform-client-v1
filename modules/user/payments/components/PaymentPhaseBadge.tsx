'use client';

import { Badge } from '@/components/ui/badge';
import type { PaymentPhase } from '../types/payments.types';

const PHASE_LABEL: Record<PaymentPhase, string> = {
  DEPOSIT: 'Deposit',
  BALANCE: 'Balance',
};

export function PaymentPhaseBadge({ phase }: { phase: PaymentPhase }) {
  return (
    <Badge variant="outline" className="font-normal">
      {PHASE_LABEL[phase] ?? phase}
    </Badge>
  );
}
