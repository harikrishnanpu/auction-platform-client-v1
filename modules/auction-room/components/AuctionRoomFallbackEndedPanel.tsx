'use client';

import { useCallback, useState } from 'react';
import { Bell, XOctagon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { AuctionRoomAlert } from './AuctionRoomAlert';
import { AuctionRoomSectionCard } from './AuctionRoomSectionCard';

type FallbackBusy = 'public' | 'failed' | null;

type AuctionRoomFallbackEndedPanelProps = {
  auctionId: string;
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
  onStatusUpdated,
  onSendPublicNotification,
  onMarkAuctionFailed,
}: AuctionRoomFallbackEndedPanelProps) {
  const [busy, setBusy] = useState<FallbackBusy>(null);
  const [error, setError] = useState<string | null>(null);

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
        return;
      }

      if (!res.success) {
        const msg =
          res.error ??
          (kind === 'public'
            ? 'Could not send public notification'
            : 'Could not mark auction as failed');
        setError(msg);
        toast.error(msg);
        return;
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
    },
    [onMarkAuctionFailed, onSendPublicNotification, onStatusUpdated]
  );

  return (
    <AuctionRoomSectionCard
      title="Fallback period ended"
      description="No winning bid was confirmed. Choose how to proceed."
    >
      {error ? (
        <AuctionRoomAlert message={error} variant="destructive" />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 justify-start gap-1.5 rounded-md text-xs"
          disabled={busy != null}
          onClick={() => run('public')}
        >
          <Bell className="size-3.5" />
          {busy === 'public' ? 'Sending…' : 'Send public notification'}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="h-8 justify-start gap-1.5 rounded-md text-xs"
          disabled={busy != null}
          onClick={() => run('failed')}
        >
          <XOctagon className="size-3.5" />
          {busy === 'failed' ? 'Updating…' : 'Mark auction as failed'}
        </Button>
      </div>
    </AuctionRoomSectionCard>
  );
}
