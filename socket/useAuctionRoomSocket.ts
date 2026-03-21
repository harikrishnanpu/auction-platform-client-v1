'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/env';
import type { IAuctionDto } from '@/types/auction.type';

import {
  AUCTION_SOCKET_EVENTS,
  type AuctionSocketControlEvent,
} from './socket.events';

export type AuctionRoomMode = 'SELLER' | 'USER' | 'ADMIN';

export interface IAuctionRoomBid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: string;
}

export interface IAuctionRoomSnapshot {
  auction: IAuctionDto;
  currentBid: IAuctionRoomBid | null;
  liveFeed: IAuctionRoomBid[];
  participants?: IAuctionRoomParticipant[];
}

export interface IAuctionRoomParticipant {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  joinedAt: string;
}

export interface IAuctionUpdatedPayload {
  auctionId: string;
  endAt?: string;
  status?: string;
  extensionCount?: number;
}

export interface IAuctionRoomChatMessage {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

type AuctionJoinedEvent = IAuctionRoomSnapshot;

type SocketControlAck = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export function useAuctionRoomSocket({
  auctionId,
  mode,
  initialAuction,
}: {
  auctionId: string;
  mode: AuctionRoomMode;
  initialAuction?: IAuctionDto;
}) {
  const socketRef = useRef<Socket | null>(null);

  const [snapshot, setSnapshot] = useState<IAuctionRoomSnapshot | null>(
    initialAuction
      ? {
          auction: initialAuction,
          currentBid: null,
          liveFeed: [],
          participants: [],
        }
      : null
  );

  const [chatMessages, setChatMessages] = useState<IAuctionRoomChatMessage[]>(
    []
  );

  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');

  const [error, setError] = useState<string | null>(null);

  const roomId = useMemo(() => `auction:${auctionId}`, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const socketBaseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '');

    const socket = io(socketBaseUrl, {
      withCredentials: true,
      path: '/socket.io',
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      timeout: 8000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setError(null);
      setConnectionState('connected');
    });

    socket.on('connect_error', (err: Error) => {
      setError(err.message);
      setConnectionState('error');
    });

    socket.on(AUCTION_SOCKET_EVENTS.JOINED, (joined: AuctionJoinedEvent) => {
      setSnapshot(joined);
      const maybeChat = (
        joined as AuctionJoinedEvent & {
          chatMessages?: IAuctionRoomChatMessage[];
        }
      ).chatMessages;
      if (Array.isArray(maybeChat)) {
        setChatMessages(maybeChat);
      }
    });

    socket.on(
      AUCTION_SOCKET_EVENTS.PARTICIPANTS_UPDATED,
      (participants: IAuctionRoomParticipant[]) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          return { ...prev, participants };
        });
      }
    );

    socket.on(
      AUCTION_SOCKET_EVENTS.CHAT_MESSAGE,
      (msg: IAuctionRoomChatMessage) => {
        setChatMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          if (exists) return prev;
          return [...prev, msg].slice(-50);
        });
      }
    );

    socket.on(AUCTION_SOCKET_EVENTS.BID_PLACED, (bid: IAuctionRoomBid) => {
      console.log('bid is', bid);
      setSnapshot((prev) => {
        if (!prev) return prev;

        const maxLiveFeed = mode === 'ADMIN' ? 10000 : 10;

        const nextLiveFeed = (() => {
          const exists = prev.liveFeed.some((b) => b.id === bid.id);
          if (exists) return prev.liveFeed;
          return [bid, ...prev.liveFeed].slice(0, maxLiveFeed);
        })();

        return {
          ...prev,
          currentBid: bid,
          liveFeed: nextLiveFeed,
        };
      });
    });

    socket.on(
      AUCTION_SOCKET_EVENTS.UPDATED,
      (payload: IAuctionUpdatedPayload) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          if (payload.auctionId !== auctionId) return prev;

          return {
            ...prev,
            auction: {
              ...prev.auction,
              ...(payload.endAt ? { endAt: new Date(payload.endAt) } : {}),
              ...(payload.status
                ? { status: payload.status as unknown as IAuctionDto['status'] }
                : {}),
            },
          };
        });
      }
    );

    socket.on(AUCTION_SOCKET_EVENTS.ERROR, (payload: { message?: string }) => {
      const message = payload?.message ?? 'Socket error';
      setError(message);
      setConnectionState('error');
    });

    socket.emit(
      AUCTION_SOCKET_EVENTS.JOIN,
      { auctionId, mode },
      (ack?: { success: boolean; error?: string }) => {
        if (ack?.success === false) {
          const message = ack.error ?? 'Failed to join';
          setError(message);
          setConnectionState('error');
        }
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnectionState('disconnected');
      setChatMessages([]);
    };
  }, [auctionId, mode]);

  const placeBid = useCallback(
    (amount: number): Promise<{ success: boolean; error?: string }> => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({ success: false, error: 'Not connected' });
      }
      return new Promise((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.PLACE_BID,
          { auctionId, amount },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Bid failed',
              });
              return;
            }
            resolve({ success: true });
          }
        );
      });
    },
    [auctionId]
  );

  const sendChatMessage = useCallback(
    (message: string) => {
      socketRef.current?.emit(AUCTION_SOCKET_EVENTS.SEND_CHAT, {
        auctionId,
        message,
      });
    },
    [auctionId]
  );

  const emitAuctionControl = useCallback(
    (
      event: AuctionSocketControlEvent
    ): Promise<{ success: boolean; error?: string }> => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({ success: false, error: 'Not connected' });
      }
      return new Promise((resolve) => {
        socket.emit(event, { auctionId }, (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Request failed',
            });
            return;
          }
          resolve({ success: true });
        });
      });
    },
    [auctionId]
  );

  const pauseAuction = useCallback(
    () => emitAuctionControl(AUCTION_SOCKET_EVENTS.PAUSE),
    [emitAuctionControl]
  );

  const resumeAuction = useCallback(
    () => emitAuctionControl(AUCTION_SOCKET_EVENTS.RESUME),
    [emitAuctionControl]
  );

  const endAuction = useCallback(
    () => emitAuctionControl(AUCTION_SOCKET_EVENTS.END),
    [emitAuctionControl]
  );

  return {
    snapshot,
    auction: snapshot?.auction ?? initialAuction ?? null,
    currentBid: snapshot?.currentBid ?? null,
    liveFeed: snapshot?.liveFeed ?? [],
    participants: snapshot?.participants ?? [],
    chatMessages,
    connectionState,
    error,
    roomId,
    placeBid,
    sendChatMessage,
    pauseAuction,
    resumeAuction,
    endAuction,
  };
}
