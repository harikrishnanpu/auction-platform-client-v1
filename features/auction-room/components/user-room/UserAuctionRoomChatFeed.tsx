'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ChevronDown, Pin, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { useChatAutoScroll } from '../../hooks/use-chat-auto-scroll';
import { getUserInitials } from '../seller-room/seller-room-helpers';

type UserAuctionRoomChatFeedProps = {
  messages: IAuctionRoomChatMessage[];
  hostUserId?: string | null;
  currentLeadUserId?: string | null;
  heroImageUrl?: string | null;
  className?: string;
  draft?: string;
  onDraftChange?: (value: string) => void;
  onSend?: () => void;
  canInteract?: boolean;
  showInput?: boolean;
};

export function UserAuctionRoomChatFeed({
  messages,
  hostUserId,
  currentLeadUserId,
  heroImageUrl,
  className,
  draft = '',
  onDraftChange,
  onSend,
  canInteract = false,
  showInput = false,
}: UserAuctionRoomChatFeedProps) {
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    endRef,
    showJumpToBottom,
    unreadWhileScrolledUp,
    onScroll,
    scrollToBottom,
  } = useChatAutoScroll(messages.length, scrollRef);

  const handleSend = () => {
    if (!canSend || !onSend) return;
    onSend();
    requestAnimationFrame(() => scrollToBottom('smooth'));
  };

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="h-full overflow-y-auto overscroll-contain px-3 py-3"
          role="log"
          aria-live="polite"
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
              <Pin className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
              <p>
                <span className="font-semibold">Hammer Down Team:</span> Welcome
                to the auction! Please bid responsibly and follow community
                guidelines.
              </p>
            </div>

            {messages.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((m) => {
                const isHost = Boolean(hostUserId && m.userId === hostUserId);
                const isLead = Boolean(
                  currentLeadUserId && m.userId === currentLeadUserId
                );
                const isBidMsg = /placed a bid|placing a bid/i.test(m.message);
                const showHostImage =
                  isHost && heroImageUrl && m.message.length > 20;

                return (
                  <div
                    key={m.id}
                    className={cn(
                      'flex gap-2 rounded-lg p-2',
                      isHost && 'bg-brand-50/80 dark:bg-brand-950/30'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                        isHost
                          ? 'bg-brand-600 text-white'
                          : 'bg-brand-100 text-brand-700'
                      )}
                    >
                      {getUserInitials(m.userName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold">
                          {m.userName}
                        </span>
                        {isHost ? (
                          <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            Host
                          </span>
                        ) : null}
                        {isLead && isBidMsg ? (
                          <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">
                            Current Lead
                          </span>
                        ) : null}
                        <time
                          className="text-[10px] text-muted-foreground"
                          dateTime={m.createdAt}
                        >
                          {formatAuctionDateTime(m.createdAt)}
                        </time>
                      </div>
                      <p className="mt-0.5 text-xs text-foreground/90">
                        {m.message}
                      </p>
                      {showHostImage ? (
                        <div className="relative mt-2 aspect-video w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={heroImageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} className="h-px shrink-0" aria-hidden />
          </div>
        </div>

        {showJumpToBottom ? (
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center px-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="pointer-events-auto h-8 gap-1.5 rounded-full border border-border bg-background/95 px-3 text-xs shadow-md backdrop-blur-sm"
              onClick={() => scrollToBottom('smooth')}
            >
              <ChevronDown className="size-3.5" />
              {unreadWhileScrolledUp > 0
                ? `${unreadWhileScrolledUp} new message${unreadWhileScrolledUp === 1 ? '' : 's'}`
                : 'Jump to latest'}
            </Button>
          </div>
        ) : null}
      </div>

      {showInput && onDraftChange && onSend ? (
        <footer className="shrink-0 border-t border-border p-3">
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Type a message..."
              disabled={!canInteract}
              className="h-9 flex-1 rounded-lg border-border text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) handleSend();
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              className="size-9 shrink-0 rounded-full bg-brand-600 hover:bg-brand-700"
              disabled={!canSend}
              onClick={handleSend}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
