'use client';

import { useState } from 'react';

import { formatAuctionDateTime } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

import { AuctionFraudReportDialog } from './AuctionFraudReportDialog';

import type { IAuctionRoomParticipant } from '@/types/auctionRoom.types';

import {
  arBtnSecondary,
  arCardCanvas,
  arType,
} from '../lib/auction-room-design';

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

/** Matches `HomeParticipatedRail`: compact title + list rows for narrow right column */
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

  return (
    <section className={cn(arCardCanvas('overflow-hidden p-3'), className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Participants
          </h2>
          <p className={cn(arType.cardDesc, 'mt-0.5')}>
            {participants.length === 1
              ? '1 registered bidder'
              : `${participants.length} registered bidders`}
          </p>
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="mt-3 flex flex-col items-center rounded-[8px] border border-dashed border-border/80 bg-muted/30 px-3 py-4 text-center dark:bg-muted/20">
          <p className="text-xs font-medium text-foreground">
            No participants yet
          </p>
          <p className="mt-1 max-w-56 text-[11px] text-muted-foreground">
            Bidders appear here once they join.
          </p>
        </div>
      ) : (
        <ul className="mt-3 max-h-52 space-y-1.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
          {participants.map((p) => {
            const isYou = p.userId === currentUserId;
            return (
              <li
                key={p.id}
                className={cn(
                  'rounded-[8px] border border-border/80 px-2 py-1.5 transition-colors',
                  isYou ? 'border-primary/25 bg-muted/40' : 'bg-card'
                )}
              >
                <div className="flex flex-col gap-1">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium leading-snug text-foreground">
                      {p.userName}
                      {isYou ? (
                        <span className="ml-1 font-normal text-muted-foreground">
                          (you)
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Joined {formatAuctionDateTime(p.joinedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    {currentUserId && p.userId === currentUserId ? null : (
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        …{p.userId.slice(-4)}
                      </span>
                    )}
                    {currentUserId &&
                    p.userId === currentUserId ? null : canReport ? (
                      <button
                        type="button"
                        className={arBtnSecondary(
                          'h-7 shrink-0 px-2 text-[11px] font-semibold'
                        )}
                        onClick={() => setReportTargetUserId(p.userId)}
                      >
                        Report
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AuctionFraudReportDialog
        open={Boolean(reportTargetUserId)}
        onOpenChange={(open) => {
          if (!open) setReportTargetUserId(null);
        }}
        title="Report participant"
        description={
          reportTargetUserId
            ? `You are reporting user ID: ${reportTargetUserId}`
            : 'Report participant'
        }
        onSubmit={async ({ reason, category, level }) => {
          if (!onReportUser || !reportTargetUserId) return;
          await onReportUser({
            targetedUserId: reportTargetUserId,
            reason,
            category,
            level,
          });
        }}
      />
    </section>
  );
}
