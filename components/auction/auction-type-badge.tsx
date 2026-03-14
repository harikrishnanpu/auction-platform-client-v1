import { Badge } from '@/components/ui/badge';
import { getAuctionTypeLabel } from '@/lib/auction-utils';
import type { AuctionType } from '@/types/auction.type';

export interface AuctionTypeBadgeProps {
  auctionType: AuctionType;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function AuctionTypeBadge({
  auctionType,
  variant = 'outline',
  className,
}: AuctionTypeBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {getAuctionTypeLabel(auctionType)}
    </Badge>
  );
}
