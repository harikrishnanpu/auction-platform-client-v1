'use client';

import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

import type { IAuctionRoomParticipant } from '../../../socket/useAuctionRoomSocket';

type AuctionRoomParticipantsPanelProps = {
  participants: IAuctionRoomParticipant[];
  currentUserId?: string;
  className?: string;
};

export function AuctionRoomParticipantsPanel({
  participants,
  currentUserId,
  className,
}: AuctionRoomParticipantsPanelProps) {
  return (
    <Card
      className={cn(
        'rounded-xl border-border/50 bg-card/30 py-0 shadow-none',
        className
      )}
    >
      <CardHeader className="gap-0 space-y-0 border-b border-border/35 px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-xs font-semibold tracking-tight">
              Participants
            </CardTitle>
            <CardDescription className="text-[10px] leading-snug">
              {participants.length === 1
                ? '1 bidder'
                : `${participants.length} bidders`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2.5 pb-2 pt-1.5">
        {participants.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted/15 px-2 py-3 text-center text-[10px] text-muted-foreground">
            No participants yet.
          </div>
        ) : (
          <ul className="max-h-36 space-y-1 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
            {participants.map((p) => {
              const isYou = p.userId === currentUserId;
              return (
                <li
                  key={p.id}
                  className={cn(
                    'flex items-center justify-between gap-1.5 rounded-lg border border-border/40 bg-background/40 px-2 py-1',
                    isYou && 'border-primary/30 bg-primary/[0.04]'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-foreground">
                      {p.userName}
                      {isYou ? (
                        <span className="ml-1 text-[9px] font-normal text-muted-foreground">
                          (you)
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {formatAuctionDateTime(p.joinedAt)}
                    </p>
                  </div>
                  {currentUserId && p.userId === currentUserId ? null : (
                    <Badge
                      variant="outline"
                      className="h-4 shrink-0 rounded px-1 text-[8px] font-normal"
                    >
                      ID …{p.userId.slice(-4)}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
