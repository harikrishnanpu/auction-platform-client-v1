'use client';

import { useCallback, useState } from 'react';

export function useAuctionRoomChat(sendChatMessage: (message: string) => void) {
  const [chatDraft, setChatDraft] = useState('');

  const sendChat = useCallback(() => {
    const trimmed = chatDraft.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed);
    setChatDraft('');
  }, [chatDraft, sendChatMessage]);

  return { chatDraft, setChatDraft, sendChat };
}
