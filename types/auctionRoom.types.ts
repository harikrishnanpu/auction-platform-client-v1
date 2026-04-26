import type {
  RtpCapabilities,
  Transport,
  IceParameters,
  IceCandidate,
  DtlsParameters,
  Device,
  RtpParameters,
} from 'mediasoup-client/types';
import { IAuctionDto } from './auction.type';

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

export type AuctionJoinedEvent = IAuctionRoomSnapshot & {
  chatMessages?: IAuctionRoomChatMessage[];
  isLiveAuction: boolean;
  isProducer: boolean;
};

export type SocketControlAck = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export type LiveCapabilitiesAck = {
  roomId: string;
  isHost: boolean;
  rtpCapabilities: RtpCapabilities;
  producerIds: string[];
};

export type LiveTransportAck = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
};

export type LiveConsumeAck = {
  id: string;
  producerId: string;
  kind: 'audio' | 'video';
  rtpParameters: RtpParameters;
};

export type RemoteStreamItem = {
  producerId: string;
  stream: MediaStream;
  kind: 'audio' | 'video';
};

export type DeviceTransportOptions = Parameters<
  Device['createRecvTransport']
>[0];
export type ConsumeOptions = Parameters<Transport['consume']>[0];
