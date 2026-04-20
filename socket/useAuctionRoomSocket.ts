'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { Device } from 'mediasoup-client';
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
import type {
  Producer,
  RtpCapabilities,
  Transport,
  Consumer,
  IceParameters,
  IceCandidate,
  DtlsParameters,
} from 'mediasoup-client/types';

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
  isLiveAuction: boolean;
  isProducer: boolean;
};

type SocketControlAck = {
  success: boolean;
  data?: unknown;
  error?: string;
};

type LiveCapabilitiesAck = {
  roomId: string;
  isHost: boolean;
  rtpCapabilities: RtpCapabilities;
  producerIds: string[];
};

type LiveTransportAck = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
};

type LiveConsumeAck = {
  id: string;
  producerId: string;
  kind: 'audio' | 'video';
  rtpParameters: unknown;
};

type RemoteStreamItem = {
  producerId: string;
  stream: MediaStream;
  kind: 'audio' | 'video';
};

type DeviceTransportOptions = Parameters<Device['createRecvTransport']>[0];
type ConsumeOptions = Parameters<Transport['consume']>[0];

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
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const producerRef = useRef<Producer[]>([]);
  const consumerRef = useRef<Map<string, Consumer>>(new Map());

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
  const [isLiveAuction, setIsLiveAuction] = useState(false);
  const [isHostProducer, setIsHostProducer] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamItem[]>([]);

  const roomId = useMemo(() => `auction:${auctionId}`, [auctionId]);

  const getLiveCapabilities = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) {
      return Promise.resolve({
        success: false as const,
        error: 'Not connected',
      });
    }

    return new Promise<{
      success: boolean;
      data?: LiveCapabilitiesAck;
      error?: string;
    }>((resolve) => {
      socket.emit(
        AUCTION_SOCKET_EVENTS.LIVE_AUCTION_GET_CAPABILITIES,
        { auctionId },
        (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Failed to load live capabilities',
            });
            return;
          }
          resolve({ success: true, data: ack?.data as LiveCapabilitiesAck });
        }
      );
    });
  }, [auctionId]);

  const createLiveTransport = useCallback(
    (transportType: 'send' | 'recv') => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({
          success: false as const,
          error: 'Not connected',
        });
      }

      const event =
        transportType === 'send'
          ? AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CREATE_SEND_TRANSPORT
          : AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CREATE_RECV_TRANSPORT;

      return new Promise<{
        success: boolean;
        data?: LiveTransportAck;
        error?: string;
      }>((resolve) => {
        socket.emit(event, { auctionId }, (ack?: SocketControlAck) => {
          if (ack?.success === false) {
            resolve({
              success: false,
              error: ack.error ?? 'Failed to create transport',
            });
            return;
          }
          resolve({ success: true, data: ack?.data as LiveTransportAck });
        });
      });
    },
    [auctionId]
  );

  const connectLiveTransport = useCallback(
    (transportType: 'send' | 'recv', dtlsParameters: unknown) => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({
          success: false as const,
          error: 'Not connected',
        });
      }

      return new Promise<{ success: boolean; error?: string }>((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONNECT_TRANSPORT,
          {
            auctionId,
            transportType,
            dtlsParameters,
          },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Failed to connect transport',
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

  const produceLiveTrack = useCallback(
    (kind: 'audio' | 'video', rtpParameters: unknown) => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({
          success: false as const,
          error: 'Not connected',
        });
      }

      return new Promise<{
        success: boolean;
        data?: { id: string };
        error?: string;
      }>((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.LIVE_AUCTION_PRODUCE,
          { auctionId, kind, rtpParameters },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Failed to produce track',
              });
              return;
            }
            resolve({ success: true, data: ack?.data as { id: string } });
          }
        );
      });
    },
    [auctionId]
  );

  const consumeLiveProducer = useCallback(
    (producerId: string, rtpCapabilities: RtpCapabilities) => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({
          success: false as const,
          error: 'Not connected',
        });
      }

      return new Promise<{
        success: boolean;
        data?: LiveConsumeAck;
        error?: string;
      }>((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONSUME,
          { auctionId, producerId, rtpCapabilities },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Failed to consume producer',
              });
              return;
            }
            resolve({ success: true, data: ack?.data as LiveConsumeAck });
          }
        );
      });
    },
    [auctionId]
  );

  const resumeLiveConsumer = useCallback(
    (consumerId: string) => {
      const socket = socketRef.current;
      if (!socket) {
        return Promise.resolve({
          success: false as const,
          error: 'Not connected',
        });
      }

      return new Promise<{ success: boolean; error?: string }>((resolve) => {
        socket.emit(
          AUCTION_SOCKET_EVENTS.LIVE_AUCTION_RESUME_CONSUMER,
          { auctionId, consumerId },
          (ack?: SocketControlAck) => {
            if (ack?.success === false) {
              resolve({
                success: false,
                error: ack.error ?? 'Failed to resume consumer',
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

  const addRemoteConsumer = useCallback(
    async (producerId: string) => {
      const device = deviceRef.current;
      const recvTransport = recvTransportRef.current;
      if (!device || !recvTransport) return;
      if (consumerRef.current.has(producerId)) return;

      const consumeRes = await consumeLiveProducer(
        producerId,
        device.rtpCapabilities
      );

      if (!consumeRes.success || !consumeRes.data) return;
      const consumeData = consumeRes.data;

      const consumeOptions: ConsumeOptions = {
        id: consumeData.id,
        producerId: consumeData.producerId,
        kind: consumeData.kind,
        rtpParameters:
          consumeData.rtpParameters as ConsumeOptions['rtpParameters'],
      };

      const consumer = await recvTransport.consume({
        ...consumeOptions,
      });

      consumerRef.current.set(producerId, consumer);
      const stream = new MediaStream([consumer.track]);
      setRemoteStreams((prev) => [
        ...prev.filter((item) => item.producerId !== producerId),
        { producerId, stream, kind: consumeData.kind },
      ]);

      await resumeLiveConsumer(consumer.id);
    },
    [consumeLiveProducer, resumeLiveConsumer]
  );

  const setupLiveAuction = useCallback(
    async (producerAllowed: boolean) => {
      const capabilities = await getLiveCapabilities();
      if (!capabilities.success || !capabilities.data) {
        setError(capabilities.error ?? 'Could not initialize live auction');
        return;
      }

      const device = new Device();
      await device.load({
        routerRtpCapabilities: capabilities.data.rtpCapabilities,
      });
      deviceRef.current = device;

      const isHost = producerAllowed && capabilities.data.isHost;
      const transportType = isHost ? 'send' : 'recv';
      const liveTransportRes = await createLiveTransport(transportType);
      if (!liveTransportRes.success || !liveTransportRes.data) return;

      const transportOptions: DeviceTransportOptions = {
        id: liveTransportRes.data.id,
        iceParameters: liveTransportRes.data.iceParameters,
        iceCandidates: liveTransportRes.data.iceCandidates,
        dtlsParameters: liveTransportRes.data.dtlsParameters,
      };

      if (!isHost) {
        const recvTransport = device.createRecvTransport(transportOptions);
        recvTransportRef.current = recvTransport;

        recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
          connectLiveTransport('recv', dtlsParameters)
            .then((res) => {
              if (!res.success) {
                errback(
                  new Error(res.error ?? 'Recv transport connect failed')
                );
                return;
              }
              callback();
            })
            .catch((err) => errback(err as Error));
        });

        for (const producerId of capabilities.data.producerIds) {
          await addRemoteConsumer(producerId);
        }
        return;
      }

      const sendTransport = device.createSendTransport(transportOptions);
      sendTransportRef.current = sendTransport;

      sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
        connectLiveTransport('send', dtlsParameters)
          .then((res) => {
            if (!res.success) {
              errback(new Error(res.error ?? 'Send transport connect failed'));
              return;
            }
            callback();
          })
          .catch((err) => errback(err as Error));
      });

      sendTransport.on(
        'produce',
        ({ kind, rtpParameters }, callback, errback) => {
          produceLiveTrack(kind, rtpParameters)
            .then((res) => {
              if (!res.success || !res.data) {
                errback(new Error(res.error ?? 'Produce failed'));
                return;
              }
              callback({ id: res.data.id });
            })
            .catch((err) => errback(err as Error));
        }
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      for (const track of stream.getTracks()) {
        const producer = await sendTransport.produce({ track });
        producerRef.current.push(producer);
      }
    },
    [
      addRemoteConsumer,
      connectLiveTransport,
      createLiveTransport,
      getLiveCapabilities,
      produceLiveTrack,
    ]
  );

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
      const {
        chatMessages: joinedChat,
        isLiveAuction,
        isProducer,
        ...room
      } = joined;
      setIsLiveAuction(isLiveAuction);
      setIsHostProducer(isProducer);

      if (isLiveAuction) {
        void setupLiveAuction(isProducer);
      }

      setSnapshot(room);
      setRoomReady(true);
      if (Array.isArray(joinedChat)) {
        setChatMessages(joinedChat);
      }
    });

    socket.on(
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_NEW_PRODUCER,
      (payload: { producerId: string }) => {
        void addRemoteConsumer(payload.producerId);
      }
    );

    socket.on(
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_PRODUCER_CLOSED,
      (payload: { producerId: string }) => {
        consumerRef.current.get(payload.producerId)?.close();
        consumerRef.current.delete(payload.producerId);
        setRemoteStreams((prev) =>
          prev.filter((item) => item.producerId !== payload.producerId)
        );
      }
    );

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

    const consumers = consumerRef.current;

    return () => {
      socket.disconnect();
      producerRef.current.forEach((producer) => producer.close());
      producerRef.current = [];
      consumers.forEach((consumer) => consumer.close());
      consumers.clear();
      sendTransportRef.current?.close();
      recvTransportRef.current?.close();
      sendTransportRef.current = null;
      recvTransportRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setRemoteStreams([]);
      setIsLiveAuction(false);
      setIsHostProducer(false);
      socketRef.current = null;
      setConnectionState('disconnected');
      setRoomReady(false);
      setChatMessages([]);
    };
  }, [addRemoteConsumer, auctionId, mode, setupLiveAuction]);

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
    isLiveAuction,
    isHostProducer,
    localStream,
    remoteStreams,
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
