'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  Auction,
  Bid,
  ChatMessage,
  Participant,
} from '@/types/auction.types';
import { BidGraph } from './bid-graph';
import { toast } from 'sonner';
import useUserStore from '@/store/user.store';
import { endAuctionAction } from '@/actions/auction/auction.actions';
import { Loader2, Flag, Trophy } from 'lucide-react';

const DUMMY_BIDS: Bid[] = [
  {
    id: 'bid-1',
    auctionId: 'dummy',
    userId: 'user-1',
    amount: 5200,
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'bid-2',
    auctionId: 'dummy',
    userId: 'user-2',
    amount: 5500,
    createdAt: new Date(Date.now() - 30000).toISOString(),
  },
];

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    userId: 'user-1',
    message: 'Good luck everyone!',
    createdAt: new Date(Date.now() - 120000).toISOString(),
    username: 'Bidder1',
  },
];

const DUMMY_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    auctionId: 'dummy',
    userId: 'user-1',
    userName: 'Bidder1',
    joinedAt: new Date(Date.now() - 300000).toISOString(),
    isOnline: true,
  },
  {
    id: 'p-2',
    auctionId: 'dummy',
    userId: 'user-2',
    userName: 'Bidder2',
    joinedAt: new Date(Date.now() - 120000).toISOString(),
    isOnline: true,
  },
];

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
  const [endingAuction, setEndingAuction] = useState(false);

  const bids = DUMMY_BIDS;
  const messages = DUMMY_MESSAGES;
  const participants = DUMMY_PARTICIPANTS;
  const error: string | null = null;
  const errorCode: string | null = null;
  const endTimeOverride: string | null = null;
  const lastBidTime: string | null =
    DUMMY_BIDS[DUMMY_BIDS.length - 1]?.createdAt ?? null;
  const statusOverride: string | null = null;
  const pausedOverride: boolean | null = null;
  const roomLoading = false;
  const placeBid = async (
    amount: number
  ): Promise<{ success: boolean; message?: string }> => {
    void amount;
    toast.info(
      'Bidding uses dummy data. Connect to server to place real bids.'
    );
    return { success: false, message: 'Dummy mode' };
  };
  const sendMessage = async (
    text: string
  ): Promise<{ success: boolean; message?: string }> => {
    void text;
    toast.info('Chat uses dummy data. Connect to server to send messages.');
    return { success: false, message: 'Dummy mode' };
  };
  const nextBidAmount = useMemo(
    () =>
      (bids.length > 0
        ? Math.max(...bids.map((b) => b.amount))
        : auction.startPrice) + auction.minIncrement,
    [bids, auction.startPrice, auction.minIncrement]
  );
  const [bidAmount, setBidAmount] = useState<number>(
    auction.startPrice + auction.minIncrement
  );
  const [chatText, setChatText] = useState('');
  const [now, setNow] = useState<Date>(new Date());

  const highestBid = useMemo(
    () =>
      bids.length > 0
        ? Math.max(...bids.map((b) => b.amount))
        : auction.startPrice,
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
    if (roomLoading || errorCode === 'USER_REVOKED') return;
    const result = await placeBid(bidAmount);
    if (!result.success) {
      toast.error(result.message || 'Failed to place bid');
      return;
    }
    toast.success('Bid placed');
  };

  useEffect(() => {
    setBidAmount(nextBidAmount);
  }, [nextBidAmount]);

  const handleSendMessage = async (): Promise<void> => {
    if (!chatText.trim()) return;
    if (roomLoading || errorCode === 'USER_REVOKED') return;
    const result = await sendMessage(chatText.trim());
    if (!result.success) {
      toast.error(result.message || 'Failed to send message');
      return;
    }
    setChatText('');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif">
            {auction.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {auction.category} • {auction.condition}
            {isSeller && (
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium">
                Seller view
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSeller && auction.status === 'ACTIVE' && (
            <button
              type="button"
              onClick={async () => {
                setEndingAuction(true);
                const res = await endAuctionAction(auction.auctionId);
                setEndingAuction(false);
                if (res.success) {
                  toast.success('Auction ended successfully');
                  onAuctionRefetch?.();
                } else {
                  toast.error(res.error ?? 'Failed to end auction');
                }
              }}
              disabled={endingAuction}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2"
            >
              {endingAuction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              {endingAuction ? 'Ending…' : 'End auction'}
            </button>
          )}
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700">
            {roomLoading ? 'Loading…' : 'Live'}
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
      {roomLoading && auctionStatus !== 'ENDED' && (
        <div className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 px-4 py-2 rounded">
          Loading auction room…
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
              onClick={() => {}}
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
              Min increment: ₹ {auction.minIncrement.toLocaleString()} · Bid
              cooldown: {auction.bidCooldownSeconds ?? 10}s · Anti-snip:{' '}
              {auction.antiSnipeThresholdSeconds ?? 60}s
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

          {!isSeller && (
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
                    roomLoading ||
                    errorCode === 'USER_REVOKED'
                  }
                  min={nextBidAmount}
                />
                <button
                  onClick={handlePlaceBid}
                  className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    auctionStatus !== 'LIVE' ||
                    cooldownRemaining > 0 ||
                    roomLoading ||
                    errorCode === 'USER_REVOKED'
                  }
                >
                  {cooldownRemaining > 0
                    ? `Wait ${cooldownRemaining}s`
                    : 'Place'}
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
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">All Bids ({bids.length})</h3>
            <div className="space-y-2 max-h-80 overflow-auto">
              {bids.length === 0 && (
                <p className="text-sm text-slate-500">No bids yet.</p>
              )}
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      ₹ {bid.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      Bidder {bid.userId.slice(0, 8)}…
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 ml-2">
                    {formatDate(bid.createdAt)}
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
            <div className="space-y-2 max-h-80 overflow-auto">
              {participants.length === 0 && (
                <p className="text-sm text-slate-500">No participants yet.</p>
              )}
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex flex-col gap-0.5 py-2 px-2 rounded-lg border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${participant.isOnline !== false ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      {participant.userName ||
                        participant.user?.username ||
                        `User ${participant.userId.slice(0, 8)}`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate">
                    ID: {participant.userId}
                  </span>
                  <span className="text-xs text-slate-400">
                    Joined {formatDate(participant.joinedAt)}
                  </span>
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
                  roomLoading ||
                  errorCode === 'USER_REVOKED'
                }
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  auctionStatus !== 'LIVE' ||
                  roomLoading ||
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
    </main>
  );
};
