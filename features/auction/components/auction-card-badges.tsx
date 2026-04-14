import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import {
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';

import {
  type AuctionCardStatusAccent,
  getAuctionCardStatusLabel,
} from '../utils/auction-card.utils';

export function AuctionCardBadges({
  auction,
  accent,
}: {
  auction: IAuctionDto;
  accent: AuctionCardStatusAccent;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Badge
        variant="secondary"
        className="h-4 max-w-[min(100%,10rem)] truncate border-0 bg-foreground/5 px-1.5 text-[9px] font-medium leading-none text-foreground/80"
      >
        {getAuctionCategoryName(auction)}
      </Badge>
      <Badge
        variant="outline"
        className="h-4 shrink-0 border-border/60 px-1.5 text-[9px] font-normal leading-none text-muted-foreground"
      >
        {getAuctionTypeLabel(auction.auctionType)}
      </Badge>
      <Badge
        variant="outline"
        className={cn(
          'h-4 shrink-0 px-1.5 text-[9px] font-semibold leading-none',
          accent.badge
        )}
      >
        {getAuctionCardStatusLabel(auction)}
      </Badge>
    </div>
  );
}
