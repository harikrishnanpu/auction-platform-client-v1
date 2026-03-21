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

import type { IAuctionRoomParticipant } from '../realtime/useAuctionRoomSocket';

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
        'rounded-xl border-border/60 bg-card/70 shadow-sm',
        // Card defaults are a bit roomy; keep this one compact.
        'py-3 gap-3',
        className
      )}
    >
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold">
              Participants
            </CardTitle>
            <CardDescription className="text-xs">
              {participants.length === 1
                ? '1 participant'
                : `${participants.length} participants`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {participants.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-background/50 px-3 py-4 text-center text-xs text-muted-foreground">
            No participants yet.
          </div>
        ) : (
          <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2"
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
