'use client';

import { useCallback, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Info,
  Maximize2,
  Pause,
  Play,
  Square,
  XOctagon,
} from 'lucide-react';
import { AUCTION_ROOM_MESSAGES } from '@/constants/auction-room/constants';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { AuctionIrreversibleConfirmDialog } from '../AuctionIrreversibleConfirmDialog';
import { AuctionRoomAlert } from '../AuctionRoomAlert';

import { srCard } from './seller-room-ui';

type ActionBusy = 'pause' | 'resume' | 'end' | null;
type FallbackBusy = 'public' | 'failed' | null;

const hostBtnBase =
  'flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border text-[13px] font-semibold transition-colors disabled:opacity-50';

export type SellerAuctionRoomHostControlsProps = {
  auctionStatusStr: string | null;
  canInteract: boolean;
  isAuctionEnded: boolean;
  actionBusy: ActionBusy;
  actionError: string | null;
  onPause: () => void;
  onResume: () => void;
  onEndConfirmOpen: () => void;
  allowSendPublicNotification: boolean;
  onAuctionStatusOverride: (status: string | null) => void;
  onSendFallbackPublicNotification: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  onMarkAuctionFailed: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
};

export function SellerAuctionRoomHostControls({
  auctionStatusStr,
  canInteract,
  isAuctionEnded,
  actionBusy,
  actionError,
  onPause,
  onResume,
  onEndConfirmOpen,
  allowSendPublicNotification,
  onAuctionStatusOverride,
  onSendFallbackPublicNotification,
  onMarkAuctionFailed,
}: SellerAuctionRoomHostControlsProps) {
  const [fallbackBusy, setFallbackBusy] = useState<FallbackBusy>(null);
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  const [failedConfirmOpen, setFailedConfirmOpen] = useState(false);

  const isFallbackEnded = auctionStatusStr === 'FALLBACK_ENDED';
  const isFallbackPublic = auctionStatusStr === 'FALLBACK_PUBLIC_NOTIFICATION';
  const isActive = auctionStatusStr === 'ACTIVE';
  const isPaused = auctionStatusStr === 'PAUSED';
  const isSold = auctionStatusStr === 'SOLD';
  const isEnded = auctionStatusStr === 'ENDED';
  const showLiveControls = isActive || isPaused;

  const runFallbackAction = useCallback(
    async (kind: 'public' | 'failed') => {
      setFallbackBusy(kind);
      setFallbackError(null);
      const res =
        kind === 'public'
          ? await onSendFallbackPublicNotification()
          : await onMarkAuctionFailed();

      setFallbackBusy(null);

      if (!res) {
        const msg = AUCTION_ROOM_MESSAGES.SOCKET_UNAVAILABLE;
        setFallbackError(msg);
        toast.error(msg);
        return false;
      }

      if (!res.success) {
        const msg =
          res.error ??
          (kind === 'public'
            ? AUCTION_ROOM_MESSAGES.PUBLIC_NOTIFICATION_FAILED
            : AUCTION_ROOM_MESSAGES.MARK_FAILED);
        setFallbackError(msg);
        toast.error(msg);
        return false;
      }

      toast.success(
        kind === 'public'
          ? AUCTION_ROOM_MESSAGES.PUBLIC_NOTIFICATION_SENT
          : AUCTION_ROOM_MESSAGES.MARKED_FAILED
      );

      const nextStatus = (res.data as { status?: string })?.status;
      if (nextStatus) {
        onAuctionStatusOverride(nextStatus);
      }
      return true;
    },
    [
      onMarkAuctionFailed,
      onSendFallbackPublicNotification,
      onAuctionStatusOverride,
    ]
  );

  return (
    <>
      <section className={srCard()}>
        <h2 className="text-sm font-semibold text-foreground">Host Controls</h2>

        {actionError ? (
          <AuctionRoomAlert
            message={actionError}
            variant="destructive"
            className="mt-3"
          />
        ) : null}

        {fallbackError ? (
          <AuctionRoomAlert
            message={fallbackError}
            variant="destructive"
            className="mt-3"
          />
        ) : null}

        {/* Live auction controls */}
        {showLiveControls ? (
          <div className="mt-4 flex flex-col gap-3">
            {isActive ? (
              <button
                type="button"
                onClick={onPause}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
                className={cn(
                  hostBtnBase,
                  'border-brand-600 text-brand-600 hover:bg-brand-50'
                )}
              >
                <Pause className="size-4" />
                Pause Auction
              </button>
            ) : null}
            {isPaused ? (
              <button
                type="button"
                onClick={onResume}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
                className={cn(
                  hostBtnBase,
                  'border-brand-600 text-brand-600 hover:bg-brand-50'
                )}
              >
                <Play className="size-4" />
                Resume Auction
              </button>
            ) : null}
            <button
              type="button"
              onClick={onEndConfirmOpen}
              disabled={!canInteract || isAuctionEnded || actionBusy != null}
              className={cn(
                hostBtnBase,
                'border-red-500 text-red-600 hover:bg-red-50'
              )}
            >
              <Square className="size-4" />
              End Auction
            </button>
            <button
              type="button"
              onClick={() => toast.info(AUCTION_ROOM_MESSAGES.ANTI_SNIPE_INFO)}
              disabled={isAuctionEnded}
              className={cn(
                hostBtnBase,
                'border-brand-600 text-brand-600 hover:bg-brand-50'
              )}
            >
              <Maximize2 className="size-4" />
              Extend Auction
            </button>
          </div>
        ) : null}

        {/* Fallback period ended */}
        {isFallbackEnded ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Fallback period ended</p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                  {allowSendPublicNotification
                    ? 'No winning bid was confirmed. Send a public offer or mark the auction as failed.'
                    : 'No winning bid was confirmed. You can mark the auction as failed.'}
                </p>
              </div>
            </div>

            {allowSendPublicNotification ? (
              <button
                type="button"
                onClick={() => void runFallbackAction('public')}
                disabled={fallbackBusy != null}
                className={cn(
                  hostBtnBase,
                  'border-brand-600 text-brand-600 hover:bg-brand-50'
                )}
              >
                <Bell className="size-4" />
                {fallbackBusy === 'public'
                  ? 'Sending…'
                  : 'Send public notification'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setFailedConfirmOpen(true)}
              disabled={fallbackBusy != null}
              className={cn(
                hostBtnBase,
                'border-red-600 text-red-600 hover:bg-red-50'
              )}
            >
              <XOctagon className="size-4" />
              {fallbackBusy === 'failed'
                ? 'Updating…'
                : 'Mark auction as failed'}
            </button>
          </div>
        ) : null}

        {/* Public fallback notification phase */}
        {isFallbackPublic ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-100">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <div>
                <p className="font-medium">Fallback window active</p>
                <p className="mt-0.5 text-xs text-brand-800/80 dark:text-brand-200/80">
                  Bidders can pay or decline the public offer. Host pause/end
                  controls are unavailable during this phase.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Terminal states */}
        {isSold ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <span>Sold — settlement complete. No further host actions.</span>
          </div>
        ) : null}

        {isEnded && !isFallbackEnded && !isFallbackPublic ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>This auction has ended. Controls are closed.</span>
          </div>
        ) : null}
      </section>

      <AuctionIrreversibleConfirmDialog
        open={failedConfirmOpen}
        onOpenChange={setFailedConfirmOpen}
        title="Mark auction as failed?"
        actionDescription="The auction will be closed as failed. This is intended when the sale cannot complete."
        confirmLabel="Mark as failed"
        confirmVariant="destructive"
        pending={fallbackBusy === 'failed'}
        onConfirm={() => runFallbackAction('failed')}
      />
    </>
  );
}
