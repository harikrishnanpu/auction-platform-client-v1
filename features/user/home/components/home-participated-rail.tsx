import Link from 'next/link';
import { ArrowRight, Handshake } from 'lucide-react';

import { appCard, appEmptyState, appInset, appListRow } from '@/lib/app-design';
import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import { getAuctionCardStatusLabel } from '@/features/auction/utils/auction-card.utils';

const AUCTION_TYPE_LABEL: Record<string, string> = {
  LONG: 'Long auction',
  LIVE: 'Live auction',
  SEALED: 'Sealed bid',
};

export interface HomeParticipatedRailProps {
  auctions: IAuctionDto[];
  totalJoined: number;
  className?: string;
}

export function HomeParticipatedRail({
  auctions,
  totalJoined,
  className,
}: HomeParticipatedRailProps) {
  return (
    <section className={cn(appCard(), className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Your auctions
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {totalJoined === 0
              ? 'Join an auction to track it here.'
              : `${totalJoined} total · showing latest ${Math.min(auctions.length, 5)}`}
          </p>
        </div>
        <Link
          href="/profile/my-auctions"
          className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          See all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className={cn(appEmptyState(), 'mt-4 px-3 py-6')}>
          <Handshake className="mx-auto mb-2 size-8 text-muted-foreground/60" />
          <p className="text-xs font-medium text-foreground">No activity yet</p>
          <p className="mt-1 max-w-[16rem] text-[11px] text-muted-foreground">
            Place a bid on any listing — it will appear here with live status.
          </p>
          <Link
            href="/auctions"
            className="mt-3 inline-block text-[11px] font-semibold text-primary underline-offset-4 hover:underline"
          >
            Explore auctions
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-1">
          {auctions.map((auction) => {
            const listingStatus = getAuctionCardStatusLabel(auction);
            const standing = auction.participation?.label ?? '—';
            const typeLine =
              AUCTION_TYPE_LABEL[auction.auctionType] ?? auction.auctionType;
            return (
              <li key={auction.id}>
                <Link
                  href={`/auction/${auction.id}`}
                  className={cn(
                    appListRow(),
                    'group flex flex-col gap-1.5 px-2 py-2'
                  )}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground group-hover:underline">
                        {auction.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {typeLine}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={cn(
                        appInset(),
                        'inline-flex px-2 py-0.5 text-[10px] font-medium text-muted-foreground'
                      )}
                    >
                      {listingStatus}
                    </span>
                    <span
                      className={cn(
                        appInset(),
                        'inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground'
                      )}
                    >
                      You: {standing}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
