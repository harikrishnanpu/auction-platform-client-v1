'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { Device } from 'mediasoup-client';
import { env } from '@/env';
import type { IAuctionDto } from '@/types/auction.type';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';
import type {
  AuctionRoomMode,
  IAuctionRoomSnapshot,
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
  IAuctionRoomBid,
  IAuctionUpdatedPayload,
  IFallbackPublicParticipantStats,
  AuctionJoinedEvent,
  SocketControlAck,
  LiveCapabilitiesAck,
  LiveTransportAck,
  LiveConsumeAck,
  RemoteStreamItem,
} from '@/types/auctionRoom.types';

import {
  AUCTION_SOCKET_EVENTS,
  type AuctionSocketControlEvent,
} from './socket.events';
import type { Producer, Transport, Consumer } from 'mediasoup-client/types';

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
  const transportRef = useRef<Transport | null>(null);

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

  const handleGetCapabilities = async (
    socket: Socket,
    roomId: string,
    role: 'host' | 'viewer'
  ) => {
    socket.emit(
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_GET_CAPABILITIES,
      { auctionId },
      async (raw: { success: boolean; data: LiveCapabilitiesAck }) => {
        const device = new Device();

        const { success, data } = raw;

        if (!success) {
          console.log(raw);
          // setError('Failed to get capabilities');
          return;
        }

        await device.load({ routerRtpCapabilities: data.rtpCapabilities });

        deviceRef.current = device;
        console.log('device loaded !kdkd', data.rtpCapabilities);
        await handleCreateTransport(socket, roomId, role, data.producerIds);
      }
    );
  };

  const handleCreateTransport = async (
    socket: Socket,
    roomId: string,
    role: 'host' | 'viewer',
    producerIds: string[]
  ) => {
    socket.emit(
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CREATE_TRANSPORT,
      { auctionId },
      async (params: { success: boolean; data: LiveTransportAck }) => {
        if (!params || !params.success || !params.data) {
          setError('Failed to create transport');
          return;
        }

        const device = deviceRef.current!;
        const transport =
          role === 'host'
            ? device.createSendTransport(params.data)
            : device.createRecvTransport(params.data);

        transportRef.current = transport;

        transport.on('connect', ({ dtlsParameters }, callback) => {
          console.log('connect dl,ts transport');
          console.log(dtlsParameters);
          socket.emit(
            AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONNECT_TRANSPORT,
            { auctionId, dtlsParameters },
            (params: { success: boolean; error?: string }) => {
              if (!params) {
                console.log('connect error from server');
                return;
              }

              if (!params.success) {
                console.log('connect error from server');
                return;
              }

              callback();
            }
          );
        });

        if (role === 'host') {
          await handleProduce(socket, roomId, transport);
        } else {
          await handleConsume(socket, roomId, producerIds);
        }
      }
    );
  };

  const handleProduce = async (
    socket: Socket,
    roomId: string,
    transport: Transport
  ) => {
    transport.on('produce', ({ kind, rtpParameters }, callback) => {
      socket.emit(
        AUCTION_SOCKET_EVENTS.LIVE_AUCTION_PRODUCE,
        { auctionId, kind, rtpParameters },
        (ack: { success: boolean; data?: { id: string } }) => {
          if (!ack || !ack.success || !ack.data) return;
          callback({ id: ack.data.id });
        }
      );
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    for (const track of stream.getTracks()) {
      await transport.produce({ track });
      console.log('producing:', track.kind);
    }
  };

  const handleConsume = async (
    socket: Socket,
    roomId: string,
    producerIds: string[]
  ) => {
    console.log('producerIds', producerIds);
    // return;

    for (const producerId of producerIds) {
      await consumeStream(socket, roomId, producerId);
    }

    socket.on(
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_NEW_PRODUCER,
      async ({ producerId }: { producerId: string; kind: string }) => {
        await consumeStream(socket, roomId, producerId);
      }
    );
  };

  const consumeStream = async (
    socket: Socket,
    roomId: string,
    producerId: string
  ) =>
    new Promise<void>((resolve) => {
      const device = deviceRef.current!;
      const transport = transportRef.current!;

      if (consumerRef.current.has(producerId)) {
        resolve();
        return;
      }

      socket.emit(
        AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONSUME,
        {
          auctionId,
          producerId,
          rtpCapabilities: device.rtpCapabilities,
        },
        async (params: { success: boolean; data: LiveConsumeAck }) => {
          if (!params || !params.success || !params.data) {
            console.log('consume error from server');
            resolve();
            return;
          }

          console.log(params);

          const consumer = await transport.consume({
            id: params.data.id,
            producerId: params.data.producerId,
            kind: params.data.kind,
            rtpParameters: params.data.rtpParameters,
          });
          consumerRef.current.set(producerId, consumer);

          console.log('consumer', consumer.track.readyState);
          console.log('consumer', consumer.track.enabled);

          console.log('consume success from server', consumer);

          setRemoteStreams((prev) => [
            ...prev.filter(
              (item) => item.producerId !== params.data.producerId
            ),
            {
              producerId: params.data.producerId,
              stream: new MediaStream([consumer.track]),
              kind: params.data.kind,
            },
          ]);

          socket.emit(
            AUCTION_SOCKET_EVENTS.LIVE_AUCTION_RESUME_CONSUMER,
            {
              auctionId,
              consumerId: params.data.id,
            },
            (ack: { success: boolean }) => {
              if (!ack?.success) {
                console.log('resume failed from server');
              }
              console.log('resume success from server');
              resolve();
            }
          );
        }
      );
    });

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

    socket.on(
      AUCTION_SOCKET_EVENTS.JOINED,
      async (joined: AuctionJoinedEvent) => {
        const {
          chatMessages: joinedChat,
          isLiveAuction,
          isProducer,
          ...room
        } = joined;
        setIsLiveAuction(isLiveAuction);
        setIsHostProducer(isProducer);

        if (isLiveAuction) {
          await handleGetCapabilities(
            socket,
            roomId,
            isProducer ? 'host' : 'viewer'
          );
        }

        setSnapshot(room);
        setRoomReady(true);
        if (Array.isArray(joinedChat)) {
          setChatMessages(joinedChat);
        }
      }
    );

    // socket.on(
    //   AUCTION_SOCKET_EVENTS.LIVE_AUCTION_NEW_PRODUCER,
    //   (payload: { producerId: string }) => {
    //     void addRemoteConsumer(payload.producerId);
    //   }
    // );

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
      (ack: { success: boolean; error?: string }) => {
        if (ack.success === false) {
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
      setRemoteStreams([]);
      transportRef.current?.close();
      transportRef.current = null;
      setLocalStream(null);
      setIsLiveAuction(false);
      setIsHostProducer(false);
      socketRef.current = null;
      setConnectionState('disconnected');
      setRoomReady(false);
      setChatMessages([]);
    };
  }, [auctionId, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  async function placeBid(
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    const socket = socketRef.current;
    if (!socket) {
      return { success: false, error: 'Not connected' };
    }

    try {
      const ack = (await socket.emitWithAck(AUCTION_SOCKET_EVENTS.PLACE_BID, {
        auctionId,
        amount,
      })) as SocketControlAck;
      if (ack.success === false) {
        return { success: false, error: ack.error ?? 'Bid failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Bid failed' };
    }
  }

  async function addAuctionParticipant(): Promise<{
    success: boolean;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket) {
      return { success: false, error: 'Not connected' };
    }

    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.ADD_AUCTION_PARTICIPANT,
        { auctionId }
      )) as SocketControlAck;
      if (ack.success === false) {
        return { success: false, error: ack.error ?? 'Could not join auction' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Could not join auction' };
    }
  }

  function sendChatMessage(message: string): void {
    socketRef.current?.emit(AUCTION_SOCKET_EVENTS.SEND_CHAT, {
      auctionId,
      message,
    });
  }

  function emitAuctionControl(
    event: AuctionSocketControlEvent
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const socket = socketRef.current;
    if (!socket) {
      return Promise.resolve({ success: false, error: 'Not connected' });
    }

    return socket
      .emitWithAck(event, { auctionId })
      .then((ack: SocketControlAck) => {
        if (ack.success === false) {
          return { success: false, error: ack.error ?? 'Request failed' };
        }
        return { success: true, data: ack.data };
      })
      .catch(() => ({ success: false, error: 'Request failed' }));
  }

  function pauseAuction() {
    return emitAuctionControl(AUCTION_SOCKET_EVENTS.PAUSE);
  }

  function resumeAuction() {
    return emitAuctionControl(AUCTION_SOCKET_EVENTS.RESUME);
  }

  function endAuction() {
    return emitAuctionControl(AUCTION_SOCKET_EVENTS.END);
  }

  function sendFallbackPublicNotification() {
    return emitAuctionControl(
      AUCTION_SOCKET_EVENTS.SEND_FALLBACK_PUBLIC_NOTIFICATION
    );
  }

  function markAuctionFailed() {
    return emitAuctionControl(AUCTION_SOCKET_EVENTS.MARK_AUCTION_FAILED);
  }

  async function payFallbackPublic(): Promise<{
    success: boolean;
    data?: IPaymentGatewayOrder;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket) {
      return { success: false, error: 'Not connected' };
    }

    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.PAY_FALLBACK_PUBLIC,
        { auctionId }
      )) as SocketControlAck;

      if (ack.success === false) {
        return { success: false, error: ack.error ?? 'Request failed' };
      }

      console.log('ack', ack.data);
      return {
        success: true,
        data: ack.data as IPaymentGatewayOrder | undefined,
      };
    } catch {
      return { success: false, error: 'Request failed' };
    }
  }

  async function declineFallbackPublic(): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket) {
      return { success: false, error: 'Not connected' };
    }

    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.DECLINE_FALLBACK_PUBLIC,
        { auctionId }
      )) as SocketControlAck;
      if (ack.success === false) {
        return { success: false, error: ack.error ?? 'Request failed' };
      }
      return { success: true, data: ack.data };
    } catch {
      return { success: false, error: 'Request failed' };
    }
  }

  async function verifyFallbackPublicAuctionPayment(
    input: IVerifyGatewayPaymentInput
  ): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket) {
      return { success: false, error: 'Not connected' };
    }

    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.VERIFY_FALLBACK_PUBLIC_AUCTION_PAYMENT,
        { auctionId, ...input }
      )) as SocketControlAck;
      if (ack.success === false) {
        return { success: false, error: ack.error ?? 'Verification failed' };
      }
      return { success: true, data: ack.data };
    } catch {
      return { success: false, error: 'Verification failed' };
    }
  }

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
