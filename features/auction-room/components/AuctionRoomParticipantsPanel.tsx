'use client';

import { useState } from 'react';
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

import type { IAuctionRoomParticipant } from '@/types/auctionRoom.types';

type AuctionRoomParticipantsPanelProps = {
  participants: IAuctionRoomParticipant[];
  currentUserId?: string;
  canReport?: boolean;
  onReportUser?: (input: {
    targetedUserId: string;
    reportedUserType?: 'USER' | 'SELLER';
    reason: string;
    category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
    level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }) => Promise<void>;
  className?: string;
};

export function AuctionRoomParticipantsPanel({
  participants,
  currentUserId,
  canReport = false,
  onReportUser,
  className,
}: AuctionRoomParticipantsPanelProps) {
  const [reportTargetUserId, setReportTargetUserId] = useState<string | null>(
    null
  );
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<
    'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER'
  >('OTHER');
  const [level, setLevel] = useState<'LOW' | 'MEDIUM' | 'CRITICAL'>('MEDIUM');

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
                    isYou && 'border-primary/30 bg-primary/4'
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
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="h-4 shrink-0 rounded px-1 text-[8px] font-normal"
                      >
                        ID …{p.userId.slice(-4)}
                      </Badge>
                      {canReport ? (
                        <button
                          type="button"
                          className="h-4 rounded border px-1 text-[8px]"
                          onClick={() => setReportTargetUserId(p.userId)}
                        >
                          Report
                        </button>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
      {reportTargetUserId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold">Report participant</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Reporting user ID: {reportTargetUserId}
            </p>
            <div className="mt-3 space-y-2">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | 'AUCTION_FRAUD_CRITICAL'
                      | 'PAYMENT_CRITICAL'
                      | 'OTHER'
                  )
                }
                className="h-9 w-full rounded border border-input bg-background px-2 text-xs"
              >
                <option value="OTHER">Other</option>
                <option value="AUCTION_FRAUD_CRITICAL">
                  Auction fraud critical
                </option>
                <option value="PAYMENT_CRITICAL">Payment critical</option>
              </select>
              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value as 'LOW' | 'MEDIUM' | 'CRITICAL')
                }
                className="h-9 w-full rounded border border-input bg-background px-2 text-xs"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[90px] w-full rounded border border-input bg-background px-2 py-2 text-xs"
                placeholder="Reason"
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="rounded border px-3 py-1 text-xs"
                onClick={() => {
                  setReportTargetUserId(null);
                  setReason('');
                }}
              >
                Cancel
              </button>
              <button
                className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
                onClick={async () => {
                  if (!onReportUser || !reason.trim()) return;
                  await onReportUser({
                    targetedUserId: reportTargetUserId,
                    reason,
                    category,
                    level,
                  });
                  setReportTargetUserId(null);
                  setReason('');
                }}
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
