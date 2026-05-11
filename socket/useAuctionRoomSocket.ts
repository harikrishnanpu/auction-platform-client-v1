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
  IAuctionRoomAutoBidConfig,
  AuctionJoinedEvent,
  SocketControlAck,
  LiveCapabilitiesAck,
  LiveTransportAck,
  LiveConsumeAck,
  RemoteStreamItem,
  IAuctionRoomMetrics,
  IAuctionRoomCharts,
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
          nextBidMin: initialAuction.startPrice,
          liveFeed: [],
          participants: [],
        }
      : null
  );

  const [chatMessages, setChatMessages] = useState<IAuctionRoomChatMessage[]>(
    []
  );

  const [agentResponses, setAgentResponses] = useState<
    { id: string; message: string; createdAt: string }[]
  >([]);

  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');

  const [error, setError] = useState<string | null>(null);

  const [roomReady, setRoomReady] = useState(false);
  const [isLiveAuction, setIsLiveAuction] = useState(false);
  const [isHostProducer, setIsHostProducer] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamItem[]>([]);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);

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
          return;
        }

        await device.load({ routerRtpCapabilities: data.rtpCapabilities });

        deviceRef.current = device;
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
          socket.emit(
            AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONNECT_TRANSPORT,
            { auctionId, dtlsParameters },
            (params: { success: boolean; error?: string }) => {
              if (!params?.success) return;
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
    setIsLocalAudioEnabled(
      stream.getAudioTracks().some((track) => track.enabled)
    );
    setIsLocalVideoEnabled(
      stream.getVideoTracks().some((track) => track.enabled)
    );

    for (const track of stream.getTracks()) {
      await transport.produce({ track });
    }
  };

  const handleConsume = async (
    socket: Socket,
    roomId: string,
    producerIds: string[]
  ) => {
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
            resolve();
            return;
          }

          const consumer = await transport.consume({
            id: params.data.id,
            producerId: params.data.producerId,
            kind: params.data.kind,
            rtpParameters: params.data.rtpParameters,
          });
          consumerRef.current.set(producerId, consumer);

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
            () => {
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

    socket.on(
      AUCTION_SOCKET_EVENTS.STATS_UPDATED,
      (payload: {
        metrics?: Partial<IAuctionRoomMetrics> | null;
        charts?: IAuctionRoomCharts | null;
      }) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          const next: IAuctionRoomSnapshot = {
            ...prev,
            metrics: { ...(prev.metrics ?? {}), ...(payload.metrics ?? {}) },
          };
          if (payload.charts !== undefined) {
            next.charts = payload.charts;
          }
          return next;
        });
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
      AUCTION_SOCKET_EVENTS.AUTO_BID_CONFIG_UPDATED,
      (config: IAuctionRoomAutoBidConfig) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            autoBidConfig: config,
          };
        });
      }
    );
    socket.on(
      AUCTION_SOCKET_EVENTS.AUTO_BID_CONFIG_CREATED,
      (config: IAuctionRoomAutoBidConfig) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            autoBidConfig: config,
          };
        });
      }
    );

    socket.on(
      AUCTION_SOCKET_EVENTS.AUTO_BID_CONFIG_EDITED,
      (config: IAuctionRoomAutoBidConfig) => {
        setSnapshot((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            autoBidConfig: config,
          };
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
      setSnapshot((prev) => {
        if (!prev) return prev;

        const maxLiveFeed = mode === 'ADMIN' ? 10000 : 1000;
        const isNewBid = !prev.liveFeed.some((b) => b.id === bid.id);

        const nextLiveFeed = (() => {
          const merged = isNewBid ? [bid, ...prev.liveFeed] : prev.liveFeed;
          return merged
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, maxLiveFeed);
        })();

        const nextCurrentBid =
          prev.currentBid == null
            ? bid
            : new Date(bid.createdAt).getTime() >=
                new Date(prev.currentBid.createdAt).getTime()
              ? bid
              : prev.currentBid;

        const nextMetrics =
          isNewBid && prev.metrics
            ? (() => {
                const m = { ...prev.metrics };
                const hourAgo = Date.now() - 60 * 60 * 1000;
                const inLastHour = new Date(bid.createdAt).getTime() >= hourAgo;

                if (typeof m.totalBidCount === 'number') {
                  m.totalBidCount = m.totalBidCount + 1;
                }
                if (typeof m.uniqueBidderCount === 'number') {
                  const hadUser = prev.liveFeed.some(
                    (b) => b.userId === bid.userId
                  );
                  if (!hadUser) m.uniqueBidderCount = m.uniqueBidderCount + 1;
                }
                if (typeof m.bidsInLastHour === 'number' && inLastHour) {
                  m.bidsInLastHour = m.bidsInLastHour + 1;
                }
                return m;
              })()
            : prev.metrics;

        return {
          ...prev,
          currentBid: nextCurrentBid,
          liveFeed: nextLiveFeed,
          metrics: nextMetrics,
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
            nextBidMin:
              payload.nextBidMin !== undefined
                ? payload.nextBidMin
                : prev.nextBidMin,
            auction: {
              ...prev.auction,
              ...(payload.endAt ? { endAt: new Date(payload.endAt) } : {}),
              ...(payload.status
                ? { status: payload.status as unknown as IAuctionDto['status'] }
                : {}),
            },
            metrics: {
              ...(prev.metrics ?? {}),
              ...(payload.extensionCount !== undefined
                ? { extensionsUsed: payload.extensionCount }
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
      setIsLocalAudioEnabled(true);
      setIsLocalVideoEnabled(true);
      setIsLiveAuction(false);
      setIsHostProducer(false);
      socketRef.current = null;
      setConnectionState('disconnected');
      setRoomReady(false);
      setChatMessages([]);
      setAgentResponses([]);
    };
  }, [auctionId, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  async function placeBid(
    amount: number
  ): Promise<{ success: boolean; error?: string; nextBidMin?: number | null }> {
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
      const payload = ack.data as
        | {
            placedBids?: IAuctionRoomBid[];
            participants?: IAuctionRoomParticipant[];
            nextBidMin?: number | null;
            endAt?: string;
          }
        | undefined;
      const placedBids = payload?.placedBids ?? [];
      if (placedBids.length > 0) {
        setSnapshot((prev) => {
          if (!prev) return prev;
          const maxLiveFeed = mode === 'ADMIN' ? 10000 : 1000;
          const placedIds = new Set(placedBids.map((b) => b.id));
          const orderedPlacedBids = placedBids
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          const merged = [
            ...orderedPlacedBids,
            ...prev.liveFeed.filter((b) => !placedIds.has(b.id)),
          ]
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          return {
            ...prev,
            currentBid:
              orderedPlacedBids[0] ??
              placedBids[placedBids.length - 1] ??
              prev.currentBid,
            liveFeed: merged.slice(0, maxLiveFeed),
            participants: payload?.participants ?? prev.participants,
            nextBidMin:
              payload?.nextBidMin !== undefined
                ? payload.nextBidMin
                : prev.nextBidMin,
            auction: {
              ...prev.auction,
              ...(payload?.endAt ? { endAt: new Date(payload.endAt) } : {}),
            },
          };
        });
      }
      return { success: true, nextBidMin: payload?.nextBidMin };
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

  async function askAgent(message: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket?.connected) {
      return { success: false, error: 'Not connected' };
    }
    try {
      const ack = (await socket
        .timeout(120_000)
        .emitWithAck(AUCTION_SOCKET_EVENTS.ASK_AGENT, {
          auctionId,
          message,
        })) as {
        success: boolean;
        data?: { response: string };
        error?: string;
      };
      if (!ack.success) {
        return { success: false, error: ack.error ?? 'Assistant failed' };
      }
      const text = ack.data?.response ?? '';
      setAgentResponses((prev) =>
        [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            message: text,
            createdAt: new Date().toISOString(),
          },
        ].slice(-50)
      );
      return { success: true };
    } catch {
      return { success: false, error: 'Request failed or timed out' };
    }
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

  async function setAutoBidConfig(input: {
    strategy: 'SLOW' | 'FASTER' | 'SNIPER';
    maxBidAmount: number;
  }): Promise<{ success: boolean; error?: string }> {
    const socket = socketRef.current;
    if (!socket) return { success: false, error: 'Not connected' };
    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.SET_AUTO_BID,
        {
          auctionId,
          strategy: input.strategy,
          maxBidAmount: input.maxBidAmount,
        }
      )) as SocketControlAck;
      if (ack.success === false) {
        return {
          success: false,
          error: ack.error ?? 'Could not enable auto bid',
        };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Could not enable auto bid' };
    }
  }

  async function disableAutoBidConfig(): Promise<{
    success: boolean;
    error?: string;
  }> {
    const socket = socketRef.current;
    if (!socket) return { success: false, error: 'Not connected' };
    try {
      const ack = (await socket.emitWithAck(
        AUCTION_SOCKET_EVENTS.DISABLE_AUTO_BID,
        { auctionId }
      )) as SocketControlAck;
      if (ack.success === false) {
        return {
          success: false,
          error: ack.error ?? 'Could not disable auto bid',
        };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Could not disable auto bid' };
    }
  }

  function toggleLocalAudio(): boolean {
    if (!localStream) return false;
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length === 0) return false;
    const nextEnabled = !audioTracks.some((track) => track.enabled);
    audioTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setIsLocalAudioEnabled(nextEnabled);
    return nextEnabled;
  }

  function toggleLocalVideo(): boolean {
    if (!localStream) return false;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length === 0) return false;
    const nextEnabled = !videoTracks.some((track) => track.enabled);
    videoTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setIsLocalVideoEnabled(nextEnabled);
    return nextEnabled;
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
    autoBidConfig: snapshot?.autoBidConfig ?? null,
    nextBidMin: snapshot?.nextBidMin ?? null,
    metrics: snapshot?.metrics ?? null,
    charts: snapshot?.charts ?? null,
    chatMessages,
    agentResponses,
    connectionState,
    error,
    roomId,
    isLiveAuction,
    isHostProducer,
    localStream,
    remoteStreams,
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleLocalAudio,
    toggleLocalVideo,
    placeBid,
    addAuctionParticipant,
    sendChatMessage,
    askAgent,
    pauseAuction,
    resumeAuction,
    endAuction,
    sendFallbackPublicNotification,
    markAuctionFailed,
    payFallbackPublic,
    declineFallbackPublic,
    verifyFallbackPublicAuctionPayment,
    setAutoBidConfig,
    disableAutoBidConfig,
  };
}
