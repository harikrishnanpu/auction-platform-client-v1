export const AUCTION_SOCKET_EVENTS = {
  JOIN: 'auction:join',
  PLACE_BID: 'auction:placeBid',
  ADD_AUCTION_PARTICIPANT: 'auction:addAuctionParticipant',
  SEND_CHAT: 'auction:sendChatMessage',
  PAUSE: 'auction:pause',
  RESUME: 'auction:resume',
  END: 'auction:end',
  SEND_FALLBACK_PUBLIC_NOTIFICATION: 'auction:sendFallbackPublicNotification',
  PAY_FALLBACK_PUBLIC: 'auction:createPaymentOrderForPublicFallbackAuction',
  DECLINE_FALLBACK_PUBLIC: 'auction:declinePaymentForPublicFallbackAuction',
  VERIFY_FALLBACK_PUBLIC_AUCTION_PAYMENT:
    'auction:verifyPaymentForPublicFallbackAuction',
  MARK_AUCTION_FAILED: 'auction:failAuction',

  JOINED: 'auction:joined',
  BID_PLACED: 'auction:bidPlaced',
  CHAT_MESSAGE: 'auction:chatMessage',
  UPDATED: 'auction:updated',
  FALLBACK_STATS_UPDATED: 'auction:fallbackStatsUpdated',
  PARTICIPANTS_UPDATED: 'auction:participantsUpdated',
  ERROR: 'auction:error',

  LIVE_AUCTION_GET_CAPABILITIES: 'auction:liveAuctionGetCapabilities',
  LIVE_AUCTION_CREATE_TRANSPORT: 'auction:liveAuctionCreateTransport',
  LIVE_AUCTION_CONNECT_TRANSPORT: 'auction:liveAuctionConnectTransport',
  LIVE_AUCTION_PRODUCE: 'auction:liveAuctionProduce',
  LIVE_AUCTION_CONSUME: 'auction:liveAuctionConsume',
  LIVE_AUCTION_RESUME_CONSUMER: 'auction:liveAuctionResumeConsumer',
  LIVE_AUCTION_NEW_PRODUCER: 'auction:liveAuctionNewProducer',
  LIVE_AUCTION_PRODUCER_CLOSED: 'auction:liveAuctionProducerClosed',
} as const;

export type AuctionSocketControlEvent =
  | typeof AUCTION_SOCKET_EVENTS.PAUSE
  | typeof AUCTION_SOCKET_EVENTS.RESUME
  | typeof AUCTION_SOCKET_EVENTS.END
  | typeof AUCTION_SOCKET_EVENTS.SEND_FALLBACK_PUBLIC_NOTIFICATION
  | typeof AUCTION_SOCKET_EVENTS.MARK_AUCTION_FAILED;
