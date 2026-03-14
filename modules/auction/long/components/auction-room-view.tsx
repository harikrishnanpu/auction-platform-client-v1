'use client';

import { useEffect, useMemo, useState } from 'react';
import { Auction } from '../types/auction.types';
import { useAuctionRoom } from '../hooks/use-auction-room';
import { BidGraph } from './bid-graph';
import { toast } from 'sonner';
import useUserStore from '@/store/user.store';
import { PaymentModal } from '@/modules/profile/components/payment-modal';
import { Trophy } from 'lucide-react';

interface AuctionRoomViewProps {
  auction: Auction;
  onAuctionRefetch?: () => void;
}

export const AuctionRoomView = ({
  auction,
  onAuctionRefetch,
}: AuctionRoomViewProps) => {
  const user = useUserStore((s) => s.user);
  const isSeller = user?.id === auction.sellerId;
  const isWinner =
    auction.status === 'ENDED' && user?.id === (auction.winnerId ?? null);
  const canPay = isWinner && auction.completionStatus !== 'PAID';
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    bids,
    messages,
    participants,
    connected,
    error,
    errorCode,
    endTimeOverride,
    lastBidTime,
    statusOverride,
    pausedOverride,
    placeBid,
    sendMessage,
  } = useAuctionRoom(auction.auctionId);
  const [bidAmount, setBidAmount] = useState<number>(auction.startPrice);
  const [chatText, setChatText] = useState('');
  const [now, setNow] = useState<Date>(new Date());

  const highestBid = useMemo(
    () => bids[0]?.amount ?? auction.startPrice,
    [bids, auction.startPrice]
  );
  const primaryMedia =
    auction.media?.find((m) => m.isPrimary) || auction.media?.[0];
  const startAt = useMemo(
    () => new Date(auction.startTime),
    [auction.startTime]
  );
  const endAt = useMemo(
    () => new Date(endTimeOverride || auction.endTime),
    [endTimeOverride, auction.endTime]
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = useMemo(() => {
    if (!lastBidTime || !auction.bidCooldownSeconds) return 0;
    const lastBid = new Date(lastBidTime);
    const elapsed = Math.floor((now.getTime() - lastBid.getTime()) / 1000);
    return Math.max(0, auction.bidCooldownSeconds - elapsed);
  }, [lastBidTime, auction.bidCooldownSeconds, now]);

  const isPaused = pausedOverride ?? auction.isPaused ?? false;

  const auctionStatus = useMemo(() => {
    if (statusOverride === 'ENDED') return 'ENDED';
    if (statusOverride === 'PAUSED') return 'PAUSED';
    if (auction.status === 'ENDED' || now > endAt) return 'ENDED';
    if (isPaused) return 'PAUSED';
    if (now < startAt) return 'UPCOMING';
    return 'LIVE';
  }, [auction.status, isPaused, now, startAt, endAt, statusOverride]);

  const liveFeed = useMemo(() => {
    const bidItems = bids.map((bid) => ({
      id: `bid-${bid.id}`,
      type: 'bid',
      text: `Bid ₹${bid.amount.toLocaleString()}`,
      createdAt: new Date(bid.createdAt).getTime(),
    }));
    const messageItems = messages.map((msg) => ({
      id: `msg-${msg.id}`,
      type: 'message',
      text: msg.message,
      createdAt: new Date(msg.createdAt).getTime(),
    }));
    return [...bidItems, ...messageItems]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);
  }, [bids, messages]);

  const timeRemainingSeconds = useMemo(() => {
    if (auctionStatus === 'UPCOMING') {
      return Math.max(
        0,
        Math.floor((startAt.getTime() - now.getTime()) / 1000)
      );
    }
    if (auctionStatus === 'LIVE') {
      return Math.max(0, Math.floor((endAt.getTime() - now.getTime()) / 1000));
    }
    return 0;
  }, [auctionStatus, startAt, endAt, now]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  };

  const handlePlaceBid = async () => {
    if (!bidAmount) return;
    if (auctionStatus !== 'LIVE') return;
    if (cooldownRemaining > 0) return;
    if (!connected || errorCode === 'USER_REVOKED') return;
    const result = await placeBid(bidAmount);
    if (!result.success) {
      toast.error(result.message || 'Failed to place bid');
      return;
    }
    toast.success('Bid placed');
  };

  const suggestedBid =
    Math.max(highestBid, auction.startPrice) + auction.minIncrement;
  useEffect(() => {
    setBidAmount(suggestedBid);
  }, [suggestedBid]);

  const handleSendMessage = async (): Promise<void> => {
    if (!chatText.trim()) return;
    if (!connected || errorCode === 'USER_REVOKED') return;
    const result = await sendMessage(chatText.trim());
    if (!result.success) {
      toast.error(result.message || 'Failed to send message');
      return;
    }
    setChatText('');
  };

  // Show error if user is the seller
  if (isSeller) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
            You&apos;re the Seller
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            As the seller of this auction, you cannot participate as a bidder.
            You can monitor and manage your auction from the seller dashboard.
          </p>
          <a
            href={`/seller/auction/${auction.auctionId}`}
            className="inline-block px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-blue-500 transition"
          >
            Go to Seller Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif">
            {auction.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {auction.category} • {auction.condition}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700">
            {connected ? 'Live' : 'Connecting'}
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {auctionStatus}
          </div>
        </div>
      </div>

      {errorCode === 'USER_REVOKED' && (
        <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="font-semibold">Access Revoked</div>
            <div className="text-sm">
              {error ||
                'You have been removed from this auction by the seller.'}
            </div>
          </div>
        </div>
      )}

      {error && errorCode !== 'USER_REVOKED' && (
        <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 px-4 py-2 rounded">
          {errorCode === 'RATE_LIMITED' && cooldownRemaining > 0
            ? `Please wait ${cooldownRemaining}s before placing another bid`
            : error}
        </div>
      )}
      {!connected && auctionStatus !== 'ENDED' && (
        <div className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 px-4 py-2 rounded">
          Connecting to live auction updates…
        </div>
      )}

      {auctionStatus === 'ENDED' && isWinner && (
        <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                You won this auction!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {canPay
                  ? `Winning bid: ₹${highestBid.toLocaleString()}. Complete payment to claim your item.`
                  : 'Payment completed. Thank you!'}
              </p>
            </div>
          </div>
          {canPay && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 shadow-md"
            >
              <Trophy className="w-4 h-4" />
              Pay Now
            </button>
          )}
        </div>
      )}

      {auctionStatus === 'ENDED' && !isWinner && !isSeller && (
        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">
          This auction has ended. You can view all details, bids, and chat below
          (read-only).
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
            {primaryMedia?.url ? (
              <img
                src={primaryMedia.url}
                alt={auction.title}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {auction.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Current Highest Bid
            </p>
            <div className="text-3xl font-bold mt-1">
              ₹ {highestBid.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Minimum increment: ₹ {auction.minIncrement.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {auctionStatus === 'UPCOMING' &&
                `Starts in ${formatDuration(timeRemainingSeconds)}`}
              {auctionStatus === 'LIVE' &&
                `Ends in ${formatDuration(timeRemainingSeconds)}`}
              {auctionStatus === 'PAUSED' && 'Auction is paused'}
              {auctionStatus === 'ENDED' && 'Auction ended'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Place Bid</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                disabled={
                  auctionStatus !== 'LIVE' ||
                  cooldownRemaining > 0 ||
                  !connected ||
                  errorCode === 'USER_REVOKED'
                }
                min={highestBid + auction.minIncrement}
              />
              <button
                onClick={handlePlaceBid}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  auctionStatus !== 'LIVE' ||
                  cooldownRemaining > 0 ||
                  !connected ||
                  errorCode === 'USER_REVOKED'
                }
              >
                {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Place'}
              </button>
            </div>
            {auctionStatus !== 'LIVE' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {auctionStatus === 'ENDED'
                  ? 'Auction ended. Bidding is closed.'
                  : 'Bidding is only available while the auction is live.'}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Live Bids</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {bids.length === 0 && (
                <p className="text-sm text-slate-500">No bids yet.</p>
              )}
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-500">
                    Bidder {bid.userId.slice(0, 6)}
                  </span>
                  <span className="font-semibold">
                    ₹ {bid.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Bid Trend</h3>
            <BidGraph bids={bids} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">
              Participants ({participants.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-auto">
              {participants.length === 0 && (
                <p className="text-sm text-slate-500">No participants yet.</p>
              )}
              {participants
                .filter((p) => !p.revokedAt)
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                    <span className="text-slate-700 dark:text-slate-300 truncate">
                      {participant.user?.username ||
                        `User ${participant.userId.slice(0, 6)}`}
                    </span>
                    {participant.isOnline && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Online
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Chat</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {messages.length === 0 && (
                <p className="text-sm text-slate-500">No messages yet.</p>
              )}
              {messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {message.username || `User ${message.userId.slice(0, 6)}`}
                  </span>
                  <span className="text-slate-500">: {message.message}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Send a message"
                disabled={
                  auctionStatus !== 'LIVE' ||
                  !connected ||
                  errorCode === 'USER_REVOKED'
                }
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  auctionStatus !== 'LIVE' ||
                  !connected ||
                  errorCode === 'USER_REVOKED'
                }
              >
                Send
              </button>
            </div>
            {auctionStatus !== 'LIVE' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {auctionStatus === 'ENDED'
                  ? 'Auction ended. Chat is read-only.'
                  : 'Chat is available while the auction is live.'}
              </p>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Live Feed</h3>
            <div className="space-y-3 max-h-64 overflow-auto">
              {liveFeed.length === 0 && (
                <p className="text-sm text-slate-500">No activity yet.</p>
              )}
              {liveFeed.map((item) => (
                <div
                  key={item.id}
                  className="text-sm flex items-center justify-between"
                >
                  <span className="text-slate-600 dark:text-slate-300">
                    {item.text}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          auction={{
            id: auction.auctionId,
            title: auction.title,
            currentPrice: highestBid,
          }}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={onAuctionRefetch}
        />
      )}
    </main>
  );
};
