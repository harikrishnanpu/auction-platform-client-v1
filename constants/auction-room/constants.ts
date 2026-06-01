export const AUCTION_ROOM_VALIDATION = {
  NOT_READY: 'Auction not ready',
  AMOUNT_REQUIRED: 'Enter a bid amount',
  INVALID_NUMBER: 'Enter a valid number',
  minBid: (minBid: number) => `Bid must be at least ${minBid}`,
} as const;

export const AUCTION_ROOM_MESSAGES = {
  SOCKET_UNAVAILABLE: 'Socket handler not available',
  PUBLIC_NOTIFICATION_FAILED: 'Could not send public notification',
  MARK_FAILED: 'Could not mark auction as failed',
  PUBLIC_NOTIFICATION_SENT: 'Public notification sent',
  MARKED_FAILED: 'Auction marked as failed',
  ANTI_SNIPE_INFO:
    'Anti-snipe extensions apply automatically when bids arrive near the end time.',
  LINK_COPIED: 'Link copied to clipboard',
  REPORT_DOWNLOAD_SOON: 'Report download coming soon',
  LOCK_FAILED: 'Could not lock amount',
  CAN_BID_NOW: 'You can place bids now',
  REPORT_FAILED: 'Failed to submit report',
  REPORT_SUBMITTED: 'Report submitted',
  AUCTION_REPORT_SUBMITTED: 'Auction report submitted',
  DECLINE_FAILED: 'Could not decline',
  OFFER_DECLINED: 'You declined the offer',
  PAYMENT_START_FAILED: 'Could not start payment',
  RAZORPAY_LOAD_FAILED: 'Unable to load Razorpay checkout',
  VERIFY_HANDLER_UNAVAILABLE: 'Verification handler not available',
  PAYMENT_VERIFY_FAILED: 'Payment verification failed',
  PAYMENT_COMPLETED: 'Payment completed',
  PAYMENT_VERIFY_CONTACT_SUPPORT:
    'Payment was taken, but verification failed. Contact support if needed.',
} as const;
