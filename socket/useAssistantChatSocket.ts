'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/env';

import { AUCTION_SOCKET_EVENTS } from './socket.events';

const ASK_TIMEOUT_MS = 120_000;

export type AskAgentSocketAck = {
  success: boolean;
  data?: { response: string };
  error?: string;
};

export type AssistantHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function useAssistantChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnection: true,
    });

    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socketRef.current = null;
      socket.disconnect();
      setConnected(false);
    };
  }, []);

  const askAgent = useCallback(
    async (
      message: string,
      lastMessages?: AssistantHistoryMessage[],
      auctionId?: string
    ): Promise<AskAgentSocketAck> => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        return { success: false, error: 'Not connected' };
      }
      try {
        const payload = auctionId
          ? { message, auctionId, lastMessages }
          : { message, lastMessages };
        const ack = await socket
          .timeout(ASK_TIMEOUT_MS)
          .emitWithAck(AUCTION_SOCKET_EVENTS.ASK_AGENT, payload);
        return ack;
      } catch {
        return { success: false, error: 'Request failed or timed out' };
      }
    },
    []
  );

  return { connected, askAgent };
}
