'use client';

import { useCallback, useState } from 'react';

export function useAuctionRoomChatSheet(
  sendChatMessage: (message: string) => void
) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState('');

  const sendChat = useCallback(() => {
    const trimmed = chatDraft.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed);
    setChatDraft('');
  }, [chatDraft, sendChatMessage]);

  return {
    chatOpen,
    setChatOpen,
    chatDraft,
    setChatDraft,
    sendChat,
  };
}
