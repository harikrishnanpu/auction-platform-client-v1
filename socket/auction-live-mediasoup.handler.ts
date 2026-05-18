import { Device } from 'mediasoup-client';
import type { Consumer, Producer, Transport } from 'mediasoup-client/types';
import type { Socket } from 'socket.io-client';

import type {
  LiveCapabilitiesAck,
  LiveConsumeAck,
  LiveTransportAck,
  RemoteStreamItem,
} from '@/types/auctionRoom.types';

import { AUCTION_SOCKET_EVENTS } from './socket.events';

export type TransportDirection = 'send' | 'recv';

type SocketAck<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuctionLiveMediasoupCallbacks = {
  onError: (message: string) => void;
  onLocalStream: (stream: MediaStream | null) => void;
  onRemoteStreams: (streams: RemoteStreamItem[]) => void;
  onLocalAudioEnabled: (enabled: boolean) => void;
  onLocalVideoEnabled: (enabled: boolean) => void;
};

function emitAck<T>(
  socket: Socket,
  event: string,
  payload: Record<string, unknown>
): Promise<SocketAck<T>> {
  return new Promise((resolve) => {
    socket.emit(event, payload, (response: SocketAck<T> | undefined) => {
      if (!response) {
        resolve({ success: false, error: 'No response from server' });
        return;
      }
      resolve(response);
    });
  });
}

export class AuctionLiveMediasoupHandler {
  private readonly socket: Socket;
  private readonly auctionId: string;
  private readonly callbacks: AuctionLiveMediasoupCallbacks;

  private device: Device | null = null;
  private sendTransport: Transport | null = null;
  private recvTransport: Transport | null = null;
  private producers: Producer[] = [];
  private consumers = new Map<string, Consumer>();
  private remoteStreams: RemoteStreamItem[] = [];
  private localStream: MediaStream | null = null;

  private isHost = false;
  private viewerReady = false;
  private pendingProducerIds = new Set<string>();

  constructor(
    socket: Socket,
    auctionId: string,
    callbacks: AuctionLiveMediasoupCallbacks
  ) {
    this.socket = socket;
    this.auctionId = auctionId;
    this.callbacks = callbacks;
  }

  async startHost(): Promise<void> {
    this.isHost = true;
    await this.loadDevice();
    await this.createAndConnectTransport('send');
    await this.publishLocalMedia();
  }

  async startViewer(): Promise<void> {
    this.isHost = false;
    const producerIds = await this.loadDevice();
    await this.createAndConnectTransport('recv');
    this.viewerReady = true;

    const idsToConsume = [
      ...new Set([...producerIds, ...this.pendingProducerIds]),
    ];
    this.pendingProducerIds.clear();

    for (const producerId of idsToConsume) {
      await this.consumeProducer(producerId);
    }
  }

  async onNewProducer(producerId: string): Promise<void> {
    if (this.isHost) return;

    if (!this.viewerReady) {
      this.pendingProducerIds.add(producerId);
      return;
    }

    await this.consumeProducer(producerId);
  }

  onProducerClosed(producerId: string): void {
    const consumer = this.consumers.get(producerId);
    if (consumer) {
      consumer.close();
      this.consumers.delete(producerId);
    }

    this.remoteStreams = this.remoteStreams.filter(
      (item) => item.producerId !== producerId
    );
    this.callbacks.onRemoteStreams([...this.remoteStreams]);
  }

  toggleLocalAudio(): boolean {
    if (!this.localStream) return false;

    const tracks = this.localStream.getAudioTracks();
    if (tracks.length === 0) return false;

    const nextEnabled = !tracks.some((track) => track.enabled);
    tracks.forEach((track) => {
      track.enabled = nextEnabled;
    });

    this.callbacks.onLocalAudioEnabled(nextEnabled);
    return nextEnabled;
  }

  toggleLocalVideo(): boolean {
    if (!this.localStream) return false;

    const tracks = this.localStream.getVideoTracks();
    if (tracks.length === 0) return false;

    const nextEnabled = !tracks.some((track) => track.enabled);
    tracks.forEach((track) => {
      track.enabled = nextEnabled;
    });

    this.callbacks.onLocalVideoEnabled(nextEnabled);
    return nextEnabled;
  }

  destroy(): void {
    this.producers.forEach((producer) => producer.close());
    this.producers = [];

    this.consumers.forEach((consumer) => consumer.close());
    this.consumers.clear();

    this.sendTransport?.close();
    this.sendTransport = null;

    this.recvTransport?.close();
    this.recvTransport = null;

    this.device = null;

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    this.remoteStreams = [];
    this.pendingProducerIds.clear();
    this.viewerReady = false;
    this.isHost = false;

    this.callbacks.onLocalStream(null);
    this.callbacks.onRemoteStreams([]);
    this.callbacks.onLocalAudioEnabled(true);
    this.callbacks.onLocalVideoEnabled(true);
  }

  private async loadDevice(): Promise<string[]> {
    const response = await emitAck<LiveCapabilitiesAck>(
      this.socket,
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_GET_CAPABILITIES,
      { auctionId: this.auctionId }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error ?? 'Failed to get live capabilities');
    }

    const device = new Device();
    await device.load({
      routerRtpCapabilities: response.data.rtpCapabilities,
    });

    this.device = device;
    return response.data.producerIds ?? [];
  }

  private async createAndConnectTransport(
    direction: TransportDirection
  ): Promise<void> {
    const createResponse = await emitAck<LiveTransportAck>(
      this.socket,
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CREATE_TRANSPORT,
      { auctionId: this.auctionId, direction }
    );

    if (!createResponse.success || !createResponse.data) {
      throw new Error(createResponse.error ?? 'Failed to create transport');
    }

    const device = this.device;
    if (!device) {
      throw new Error('Mediasoup device not loaded');
    }

    const transport =
      direction === 'send'
        ? device.createSendTransport(createResponse.data)
        : device.createRecvTransport(createResponse.data);

    if (direction === 'send') {
      this.sendTransport = transport;
    } else {
      this.recvTransport = transport;
    }

    transport.on('connect', ({ dtlsParameters }, callback) => {
      void emitAck<null>(
        this.socket,
        AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONNECT_TRANSPORT,
        {
          auctionId: this.auctionId,
          direction,
          dtlsParameters,
        }
      ).then((connectResponse) => {
        if (!connectResponse.success) {
          this.callbacks.onError(
            connectResponse.error ?? 'Failed to connect transport'
          );
          return;
        }
        callback();
      });
    });

    if (direction === 'send') {
      transport.on('produce', ({ kind, rtpParameters }, callback) => {
        void emitAck<{ id: string }>(
          this.socket,
          AUCTION_SOCKET_EVENTS.LIVE_AUCTION_PRODUCE,
          { auctionId: this.auctionId, kind, rtpParameters }
        ).then((produceResponse) => {
          if (!produceResponse.success || !produceResponse.data?.id) {
            this.callbacks.onError(
              produceResponse.error ?? 'Failed to publish track'
            );
            return;
          }
          callback({ id: produceResponse.data.id });
        });
      });
    }
  }

  private async publishLocalMedia(): Promise<void> {
    const transport = this.sendTransport;
    if (!transport) {
      throw new Error('Send transport not ready');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.localStream = stream;
    this.callbacks.onLocalStream(stream);
    this.callbacks.onLocalAudioEnabled(
      stream.getAudioTracks().some((track) => track.enabled)
    );
    this.callbacks.onLocalVideoEnabled(
      stream.getVideoTracks().some((track) => track.enabled)
    );

    for (const track of stream.getTracks()) {
      const producer = await transport.produce({ track });
      this.producers.push(producer);
    }
  }

  private async consumeProducer(producerId: string): Promise<void> {
    if (this.consumers.has(producerId)) return;

    const device = this.device;
    const transport = this.recvTransport;

    if (!device || !transport) {
      this.callbacks.onError('Receive transport not ready');
      return;
    }

    const response = await emitAck<LiveConsumeAck>(
      this.socket,
      AUCTION_SOCKET_EVENTS.LIVE_AUCTION_CONSUME,
      {
        auctionId: this.auctionId,
        producerId,
        rtpCapabilities: device.rtpCapabilities,
      }
    );

    if (!response.success || !response.data) {
      this.callbacks.onError(response.error ?? 'Failed to consume stream');
      return;
    }

    const consumeData = response.data;

    try {
      const consumer = await transport.consume({
        id: consumeData.id,
        producerId: consumeData.producerId,
        kind: consumeData.kind,
        rtpParameters: consumeData.rtpParameters,
      });

      this.consumers.set(producerId, consumer);

      this.remoteStreams = [
        ...this.remoteStreams.filter(
          (item) => item.producerId !== consumeData.producerId
        ),
        {
          producerId: consumeData.producerId,
          stream: new MediaStream([consumer.track]),
          kind: consumeData.kind,
        },
      ];

      this.callbacks.onRemoteStreams([...this.remoteStreams]);

      if (consumer.paused) {
        await consumer.resume();
      }
    } catch {
      this.callbacks.onError('Failed to play live stream');
    }
  }
}
