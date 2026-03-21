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
import { formatAuctionDateTime } from '@/lib/auction-utils';
import { cn } from '@/lib/utils';

import type { IAuctionRoomParticipant } from '../../../socket/useAuctionRoomSocket';

type AuctionRoomParticipantsPanelProps = {
  participants: IAuctionRoomParticipant[];
  className?: string;
};

export function AuctionRoomParticipantsPanel({
  participants,
  className,
}: AuctionRoomParticipantsPanelProps) {
  return (
    <Card
      className={cn(
        'rounded-lg border-border/60 bg-card/70 shadow-sm',
        'py-2 gap-2',
        className
      )}
    >
      <CardHeader className="px-3 pb-1 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Users className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-xs font-semibold">
              Participants
            </CardTitle>
            <CardDescription className="text-[10px] leading-tight">
              {participants.length === 1
                ? '1 participant'
                : `${participants.length} participants`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        {participants.length === 0 ? (
          <div className="rounded-md border border-border/50 bg-background/50 px-2 py-3 text-center text-[11px] text-muted-foreground">
            No participants yet.
          </div>
        ) : (
          <ul className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-background/40 px-2 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {p.userName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatAuctionDateTime(p.joinedAt)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-md px-2 py-0 text-[10px]"
                >
                  {p.userId.slice(0, 6)}…
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
