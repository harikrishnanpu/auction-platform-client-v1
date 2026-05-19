'use client';

import { useMemo, useState } from 'react';
import { Flag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type { IAuctionRoomParticipant } from '@/types/auctionRoom.types';

import { AuctionFraudReportDialog } from '../AuctionFraudReportDialog';
import { getUserInitials } from '../seller-room/seller-room-helpers';

type ReportParticipantInput = {
  targetedUserId: string;
  reason: string;
  category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
  level: 'LOW' | 'MEDIUM' | 'CRITICAL';
};

type UserAuctionRoomParticipantsReportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: IAuctionRoomParticipant[];
  sellerId?: string | null;
  currentUserId?: string | null;
  onReportParticipant: (input: ReportParticipantInput) => Promise<void>;
};

export function UserAuctionRoomParticipantsReportModal({
  open,
  onOpenChange,
  participants,
  sellerId,
  currentUserId,
  onReportParticipant,
}: UserAuctionRoomParticipantsReportModalProps) {
  const [reportTarget, setReportTarget] =
    useState<IAuctionRoomParticipant | null>(null);

  const sortedParticipants = useMemo(
    () =>
      [...participants].sort(
        (a, b) =>
          new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      ),
    [participants]
  );

  const handleListOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setReportTarget(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleListOpenChange}>
        <DialogContent className="flex max-h-[min(85vh,560px)] max-w-md flex-col gap-0 p-0">
          <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
            <DialogTitle className="text-base">
              Auction participants
            </DialogTitle>
            <DialogDescription>
              Registered bidders in this auction. You can report a participant
              if you notice suspicious behaviour.
            </DialogDescription>
          </DialogHeader>

          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3">
            {sortedParticipants.length === 0 ? (
              <li className="py-10 text-center text-sm text-muted-foreground">
                No participants yet.
              </li>
            ) : (
              sortedParticipants.map((p) => {
                const isYou = Boolean(
                  currentUserId && p.userId === currentUserId
                );
                const isHost = Boolean(sellerId && p.userId === sellerId);
                const canReport = !isYou;

                return (
                  <li
                    key={p.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border border-border/80 px-3 py-2.5',
                      isYou &&
                        'border-brand-200 bg-brand-50/50 dark:bg-brand-950/20'
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                      {getUserInitials(p.userName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {p.userName}
                        {isYou ? (
                          <span className="ml-1 font-normal text-muted-foreground">
                            (you)
                          </span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Joined {formatAuctionDateTime(p.joinedAt)}
                      </p>
                      {isHost ? (
                        <span className="mt-1 inline-flex rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">
                          Host
                        </span>
                      ) : null}
                    </div>
                    {canReport ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 gap-1 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                        onClick={() => setReportTarget(p)}
                      >
                        <Flag className="size-3.5" />
                        Report
                      </Button>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </DialogContent>
      </Dialog>

      <AuctionFraudReportDialog
        open={Boolean(reportTarget)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setReportTarget(null);
        }}
        title="Report participant"
        description={
          reportTarget
            ? `You are reporting ${reportTarget.userName} for misconduct in this auction.`
            : 'Report participant'
        }
        submitLabel="Submit report"
        onSubmit={async ({ reason, category, level }) => {
          if (!reportTarget) return;
          await onReportParticipant({
            targetedUserId: reportTarget.userId,
            reason,
            category,
            level,
          });
          setReportTarget(null);
        }}
      />
    </>
  );
}
