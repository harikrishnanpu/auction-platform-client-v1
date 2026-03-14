import { Badge } from '@/components/ui/badge';
import { getAuctionStatusLabel } from '@/lib/auction-utils';

export interface AuctionStatusBadgeProps {
  status: string;
  label?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function AuctionStatusBadge({
  status,
  label,
  variant = 'secondary',
  className,
}: AuctionStatusBadgeProps) {
  const displayLabel = label ?? getAuctionStatusLabel(status);
  return (
    <Badge variant={variant} className={className}>
      {displayLabel}
    </Badge>
  );
}
