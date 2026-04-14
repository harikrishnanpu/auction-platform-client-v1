'use client';

import { useCallback, useState } from 'react';

type ActionBusy = 'pause' | 'resume' | 'end' | null;

export function useAuctionRoomHostControls({
  pauseAuction,
  resumeAuction,
  endAuction,
}: {
  pauseAuction: () => Promise<{ success: boolean; error?: string }>;
  resumeAuction: () => Promise<{ success: boolean; error?: string }>;
  endAuction: () => Promise<{ success: boolean; error?: string }>;
}) {
  const [actionBusy, setActionBusy] = useState<ActionBusy>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handlePause = useCallback(async () => {
    setActionBusy('pause');
    setActionError(null);
    const res = await pauseAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to pause auction');
    }
  }, [pauseAuction]);

  const handleResume = useCallback(async () => {
    setActionBusy('resume');
    setActionError(null);
    const res = await resumeAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to resume auction');
    }
  }, [resumeAuction]);

  const handleEnd = useCallback(async (): Promise<boolean> => {
    setActionBusy('end');
    setActionError(null);
    const res = await endAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to end auction');
      return false;
    }
    return true;
  }, [endAuction]);

  return {
    actionBusy,
    actionError,
    handlePause,
    handleResume,
    handleEnd,
  };
}
