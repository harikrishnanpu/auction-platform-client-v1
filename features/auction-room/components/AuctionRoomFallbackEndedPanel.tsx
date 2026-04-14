'use client';

import { useCallback, useState } from 'react';
import { Bell, XOctagon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { AuctionIrreversibleConfirmDialog } from './AuctionIrreversibleConfirmDialog';
import { AuctionRoomAlert } from './AuctionRoomAlert';
import { AuctionRoomSectionCard } from './AuctionRoomSectionCard';

type FallbackBusy = 'public' | 'failed' | null;

type AuctionRoomFallbackEndedPanelProps = {
  auctionId: string;
  allowSendPublicNotification?: boolean;
  onStatusUpdated?: (status: string) => void;
  onSendPublicNotification?: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  onMarkAuctionFailed?: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
};

export function AuctionRoomFallbackEndedPanel({
  allowSendPublicNotification = true,
  onStatusUpdated,
  onSendPublicNotification,
  onMarkAuctionFailed,
}: AuctionRoomFallbackEndedPanelProps) {
  const [busy, setBusy] = useState<FallbackBusy>(null);
  const [error, setError] = useState<string | null>(null);
  const [failedConfirmOpen, setFailedConfirmOpen] = useState(false);

  const run = useCallback(
    async (kind: 'public' | 'failed') => {
      setBusy(kind);
      setError(null);
      const res =
        kind === 'public'
          ? await onSendPublicNotification?.()
          : await onMarkAuctionFailed?.();

      setBusy(null);

      if (!res) {
        const msg = 'Socket handler not available';
        setError(msg);
        toast.error(msg);
        return false;
      }

      if (!res.success) {
        const msg =
          res.error ??
          (kind === 'public'
            ? 'Could not send public notification'
            : 'Could not mark auction as failed');
        setError(msg);
        toast.error(msg);
        return false;
      }

      toast.success(
        kind === 'public'
          ? 'Public notification sent'
          : 'Auction marked as failed'
      );

      const nextStatus = (res.data as { status?: string })?.status;
      if (nextStatus) {
        onStatusUpdated?.(nextStatus);
      }
      return true;
    },
    [onMarkAuctionFailed, onSendPublicNotification, onStatusUpdated]
  );

  return (
    <>
      <AuctionRoomSectionCard
        title="Fallback period ended"
        description={
          allowSendPublicNotification
            ? 'No winning bid was confirmed. Choose how to proceed.'
            : 'No winning bid was confirmed. You can mark the auction as failed.'
        }
      >
        {error ? (
          <AuctionRoomAlert message={error} variant="destructive" />
        ) : null}

        <div className="flex flex-col gap-1.5">
          {allowSendPublicNotification ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 justify-start gap-1 rounded-md text-[11px]"
              disabled={busy != null}
              onClick={() => run('public')}
            >
              <Bell className="size-3.5" />
              {busy === 'public' ? 'Sending…' : 'Send public notification'}
            </Button>
          ) : null}
          <Button
            variant="destructive"
            size="sm"
            className="h-7 justify-start gap-1 rounded-md text-[11px]"
            disabled={busy != null}
            onClick={() => setFailedConfirmOpen(true)}
          >
            <XOctagon className="size-3.5" />
            Mark auction as failed
          </Button>
        </div>
      </AuctionRoomSectionCard>

      <AuctionIrreversibleConfirmDialog
        open={failedConfirmOpen}
        onOpenChange={setFailedConfirmOpen}
        title="Mark auction as failed?"
        actionDescription="The auction will be closed as failed. This is intended when the sale cannot complete."
        confirmLabel="Mark as failed"
        confirmVariant="destructive"
        pending={busy === 'failed'}
        onConfirm={() => run('failed')}
      />
    </>
  );
}
