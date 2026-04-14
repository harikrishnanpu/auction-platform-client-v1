'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/env';
import type { IAuctionDto } from '@/types/auction.type';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';

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

export interface IFallbackPublicParticipantStats {
  pending: number;
  rejected: number;
}

export interface IAuctionSoldSummary {
  winnerUserName: string;
  winnerUserId: string;
  soldAmount: number;
}

export interface IAuctionRoomSnapshot {
  auction: IAuctionDto;
  currentBid: IAuctionRoomBid | null;
  liveFeed: IAuctionRoomBid[];
  participants?: IAuctionRoomParticipant[];
  fallbackPublicParticipantStats?: IFallbackPublicParticipantStats;
  soldSummary?: IAuctionSoldSummary;
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

type AuctionJoinedEvent = IAuctionRoomSnapshot & {
  chatMessages?: IAuctionRoomChatMessage[];
};

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

  const [roomReady, setRoomReady] = useState(false);

  const roomId = useMemo(() => `auction:${auctionId}`, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const socketBaseUrl = env.NEXT_PUBLIC_SOCKET_URL;

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
      const { chatMessages: joinedChat, ...room } = joined;
      setSnapshot(room);
      setRoomReady(true);
      if (Array.isArray(joinedChat)) {
        setChatMessages(joinedChat);
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
      console.log('BID_PLACED', bid);
      setSnapshot((prev) => {
        if (!prev) return prev;

        const maxLiveFeed = mode === 'ADMIN' ? 10000 : 1000;

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
        console.log('UPDATED', payload);
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

    socket.on(
      AUCTION_SOCKET_EVENTS.FALLBACK_STATS_UPDATED,
      (payload: {
        auctionId: string;
        fallbackPublicParticipantStats: IFallbackPublicParticipantStats;
      }) => {
        if (payload.auctionId !== auctionId) return;
        setSnapshot((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            fallbackPublicParticipantStats:
              payload.fallbackPublicParticipantStats,
          };
        });
      }
    );

    socket.on(AUCTION_SOCKET_EVENTS.ERROR, (payload: { message?: string }) => {
      console.log('ERROR', payload);
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
      setRoomReady(false);
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

  const addAuctionParticipant = useCallback((): Promise<{
    success: boolean;
    error?: string;
  }> => {
    const socket = socketRef.current;
    if (!socket) {
      return Promise.resolve({ success: false, error: 'Not connected' });
    }
    return new Promise((resolve) => {
      socket.emit(
        AUCTION_SOCKET_EVENTS.ADD_AUCTION_PARTICIPANT,
        { auctionId },
        (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Could not join auction',
            });
            return;
          }
          resolve({ success: true });
        }
      );
    });
  }, [auctionId]);

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
    ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
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
          resolve({ success: true, data: ack?.data });
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

  const sendFallbackPublicNotification = useCallback(
    () =>
      emitAuctionControl(
        AUCTION_SOCKET_EVENTS.SEND_FALLBACK_PUBLIC_NOTIFICATION
      ),
    [emitAuctionControl]
  );

  const markAuctionFailed = useCallback(
    () => emitAuctionControl(AUCTION_SOCKET_EVENTS.MARK_AUCTION_FAILED),
    [emitAuctionControl]
  );

  const payFallbackPublic = useCallback((): Promise<{
    success: boolean;
    data?: IPaymentGatewayOrder;
    error?: string;
  }> => {
    const socket = socketRef.current;
    if (!socket) {
      return Promise.resolve({ success: false, error: 'Not connected' });
    }

    return new Promise((resolve) => {
      socket.emit(
        AUCTION_SOCKET_EVENTS.PAY_FALLBACK_PUBLIC,
        { auctionId },
        (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Request failed',
            });
            return;
          }
          resolve({
            success: true,
            data: ack?.data as IPaymentGatewayOrder | undefined,
          });
        }
      );
    });
  }, [auctionId]);

  const declineFallbackPublic = useCallback((): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }> => {
    const socket = socketRef.current;
    if (!socket) {
      return Promise.resolve({ success: false, error: 'Not connected' });
    }
    return new Promise((resolve) => {
      socket.emit(
        AUCTION_SOCKET_EVENTS.DECLINE_FALLBACK_PUBLIC,
        { auctionId },
        (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Request failed',
            });
            return;
          }
          resolve({ success: true, data: ack?.data });
        }
      );
    });
  }, [auctionId]);

  const verifyFallbackPublicAuctionPayment = useCallback(
    (
      input: IVerifyGatewayPaymentInput
    ): Promise<{
      success: boolean;
      data?: unknown;
      error?: string;
    }> => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({ success: false, error: 'Not connected' });
      }
      return new Promise((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.VERIFY_FALLBACK_PUBLIC_AUCTION_PAYMENT,
          { auctionId, ...input },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Verification failed',
              });
              return;
            }

            resolve({ success: true, data: ack?.data });
          }
        );
      });
    },
    [auctionId]
  );

  return {
    snapshot,
    roomReady,
    auction: snapshot?.auction ?? initialAuction ?? null,
    currentBid: snapshot?.currentBid ?? null,
    liveFeed: snapshot?.liveFeed ?? [],
    participants: snapshot?.participants ?? [],
    fallbackPublicParticipantStats:
      snapshot?.fallbackPublicParticipantStats ?? null,
    soldSummary: snapshot?.soldSummary ?? null,
    chatMessages,
    connectionState,
    error,
    roomId,
    placeBid,
    addAuctionParticipant,
    sendChatMessage,
    pauseAuction,
    resumeAuction,
    endAuction,
    sendFallbackPublicNotification,
    markAuctionFailed,
    payFallbackPublic,
    declineFallbackPublic,
    verifyFallbackPublicAuctionPayment,
  };
}
