'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AuctionRoomState,
  Bid,
  ChatMessage,
  Participant,
} from '../types/auction.types';
import {
  disconnectAuctionSocket,
  getAuctionSocket,
} from '../services/auction-socket';

interface AuctionRoomStateView {
  bids: Bid[];
  messages: ChatMessage[];
  participants: Participant[];
  connected: boolean;
  error: string | null;
  errorCode: string | null;
  endTimeOverride: string | null;
  lastBidTime: string | null;
  statusOverride: 'PAUSED' | 'ENDED' | null;
  pausedOverride: boolean | null;
}

export const useAuctionRoom = (
  auctionId: string,
  options: { mode?: 'user' | 'seller' | 'admin' } = {}
) => {
  const mode = options.mode ?? 'user';
  const [state, setState] = useState<AuctionRoomStateView>({
    bids: [],
    messages: [],
    participants: [],
    connected: false,
    error: null,
    errorCode: null,
    endTimeOverride: null,
    lastBidTime: null,
    statusOverride: null,
    pausedOverride: null,
  });

  useEffect(() => {
    if (!auctionId) return;
    const socket = getAuctionSocket();

    const handleConnect = () => {
      setState((prev) => ({
        ...prev,
        connected: true,
        error: null,
        errorCode: null,
      }));
      if (mode === 'seller') socket.emit('seller:join', { auctionId });
      else if (mode === 'admin') socket.emit('admin:join', { auctionId });
      else socket.emit('room:join', { auctionId });
    };

    const handleDisconnect = () =>
      setState((prev) => ({ ...prev, connected: false }));

    const handleConnectError = async (err: Error) => {
      console.log('Socket Connection Error:', err.message);
      if (
        err.message === 'Unauthorized' ||
        err.message.includes('jwt expired')
      ) {
        try {
          console.log('Attempting token refresh...');
          await api.post('/auth/refresh-token');
          socket.disconnect();
          socket.connect();
          return;
        } catch (e) {
          console.log('Token refresh failed:', e);
        }
      }
      setState((prev) => ({
        ...prev,
        connected: false,
        error: err.message || 'Socket connection failed',
        errorCode: 'SOCKET_ERROR',
      }));
    };

    const handleRoomState = (payload: AuctionRoomState) => {
      const roomAuction = payload.auction;
      setState((prev) => ({
        ...prev,
        bids: payload.latestBids || [],
        messages: payload.latestMessages || [],
        participants: payload.participants || [],
        lastBidTime: payload.lastBidTime || null,
        pausedOverride: roomAuction?.isPaused ?? prev.pausedOverride,
        statusOverride:
          roomAuction?.status === 'ENDED'
            ? 'ENDED'
            : roomAuction?.isPaused
              ? 'PAUSED'
              : prev.statusOverride,
        error: null,
        errorCode: null,
      }));
    };

    const handleBidCreated = (bid: Bid) => {
      setState((prev) => ({
        ...prev,
        bids: [bid, ...prev.bids],
        error: null,
        errorCode: null,
      }));
    };

    const handleChatCreated = (message: ChatMessage) => {
      setState((prev) => ({
        ...prev,
        messages: [message, ...prev.messages],
        error: null,
        errorCode: null,
      }));
    };

    const handleError = (payload: { message: string; code?: string }) => {
      setState((prev) => ({
        ...prev,
        error: payload.message,
        errorCode: payload.code || null,
      }));
    };

    const handleAuctionExtended = (payload: { newEndTime: string }) => {
      setState((prev) => ({ ...prev, endTimeOverride: payload.newEndTime }));
    };

    const handleAuctionPaused = () => {
      setState((prev) => ({
        ...prev,
        statusOverride: 'PAUSED',
        pausedOverride: true,
      }));
    };

    const handleAuctionResumed = () => {
      setState((prev) => ({
        ...prev,
        statusOverride: null,
        pausedOverride: false,
      }));
    };

    const handleAuctionEnded = () => {
      setState((prev) => ({
        ...prev,
        statusOverride: 'ENDED',
        pausedOverride: false,
      }));
    };

    const handleUserRevoked = (payload: { message: string; code?: string }) => {
      setState((prev) => ({
        ...prev,
        error: payload.message,
        errorCode: payload.code || 'USER_REVOKED',
      }));
    };

    const handleParticipantOnline = (payload: {
      userId: string;
      socketId: string;
    }) => {
      setState((prev) => ({
        ...prev,
        participants: prev.participants.map((p) =>
          p.userId === payload.userId
            ? { ...p, isOnline: true, socketId: payload.socketId }
            : p
        ),
      }));
    };

    const handleParticipantOffline = (payload: {
      userId: string;
      socketId: string;
    }) => {
      setState((prev) => ({
        ...prev,
        participants: prev.participants.map((p) =>
          p.userId === payload.userId ? { ...p, isOnline: false } : p
        ),
      }));
    };

    const handleParticipantsUpdated = (payload: {
      participants: Participant[];
    }) => {
      setState((prev) => ({
        ...prev,
        participants: payload.participants || [],
      }));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('room:state', handleRoomState);
    socket.on('bid:created', handleBidCreated);
    socket.on('chat:created', handleChatCreated);
    socket.on('room:error', handleError);
    socket.on('bid:error', handleError);
    socket.on('chat:error', handleError);
    socket.on('auction:extended', handleAuctionExtended);
    socket.on('auction:paused', handleAuctionPaused);
    socket.on('auction:resumed', handleAuctionResumed);
    socket.on('auction:ended', handleAuctionEnded);
    socket.on('user:revoked', handleUserRevoked);
    socket.on('participant:online', handleParticipantOnline);
    socket.on('participant:offline', handleParticipantOffline);
    socket.on('participants:updated', handleParticipantsUpdated);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('room:state', handleRoomState);
      socket.off('bid:created', handleBidCreated);
      socket.off('chat:created', handleChatCreated);
      socket.off('room:error', handleError);
      socket.off('bid:error', handleError);
      socket.off('chat:error', handleError);
      socket.off('auction:extended', handleAuctionExtended);
      socket.off('auction:paused', handleAuctionPaused);
      socket.off('auction:resumed', handleAuctionResumed);
      socket.off('auction:ended', handleAuctionEnded);
      socket.off('user:revoked', handleUserRevoked);
      socket.off('participant:online', handleParticipantOnline);
      socket.off('participant:offline', handleParticipantOffline);
      socket.off('participants:updated', handleParticipantsUpdated);
      disconnectAuctionSocket();
    };
  }, [auctionId, mode]);

  const actions = useMemo(() => {
    const emitWithAck = <
      T extends { success?: boolean; message?: string; code?: string },
    >(
      event: string,
      payload: Record<string, unknown>,
      timeoutMs: number = 6000
    ) =>
      new Promise<T & { success: boolean }>((resolve) => {
        const socket = getAuctionSocket();
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          resolve({ success: false, message: 'Socket timeout' } as T & {
            success: boolean;
          });
        }, timeoutMs);

        if (!socket.connected) {
          console.warn(
            '[Frontend] Emitting event on disconnected socket:',
            event
          );
        }

        socket.emit(event, payload, (response: T) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (response?.success) {
            resolve({ ...response, success: true });
          } else {
            resolve({ ...response, success: false });
          }
        });
      });

    return {
      placeBid: (amount: number) => {
        console.log('[Frontend] placeBid called with amount:', amount);
        return emitWithAck('bid:place', { auctionId, amount });
      },
      sendMessage: (message: string) => {
        console.log('[Frontend] sendMessage called with message:', message);
        return emitWithAck('chat:send', {
          auctionId,
          message,
          isSeller: mode === 'seller',
        });
      },
      revokeUser: (userId: string) => {
        console.log('[Frontend] revokeUser called with userId:', userId);
        const socket = getAuctionSocket();
        socket.emit('seller:revoke-user', { auctionId, userId });
      },
      unrevokeUser: (userId: string) => {
        console.log('[Frontend] unrevokeUser called with userId:', userId);
        const socket = getAuctionSocket();
        socket.emit('seller:unrevoke-user', { auctionId, userId });
      },
      pauseAuction: () => emitWithAck('seller:pause-auction', { auctionId }),
      resumeAuction: () => emitWithAck('seller:resume-auction', { auctionId }),
      endAuction: () => emitWithAck('seller:end-auction', { auctionId }),
    };
  }, [auctionId, mode]);

  return { ...state, ...actions };
};
