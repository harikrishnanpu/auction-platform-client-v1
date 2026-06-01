'use client';

import { useRef } from 'react';
import { ChevronDown, Pin, Send, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { useChatAutoScroll } from '../../hooks/use-chat-auto-scroll';
import { getUserInitials } from '../seller-room/seller-room-helpers';
import { urCard } from './user-room-ui';

type UserAuctionRoomChatProps = {
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  participantsCount: number;
  currentLeadUserId?: string | null;
  className?: string;
};

const CHAT_SHELL_HEIGHT =
  'h-[min(420px,58vh)] max-h-[min(420px,58vh)] min-[1320px]:h-[calc(100dvh-5.5rem)] min-[1320px]:max-h-[calc(100dvh-5.5rem)]';

export function UserAuctionRoomChat({
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  participantsCount,
  currentLeadUserId,
  className,
}: UserAuctionRoomChatProps) {
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { showJumpToBottom, unreadWhileScrolledUp, onScroll, scrollToBottom } =
    useChatAutoScroll(messages.length, scrollRef);

  const handleSend = () => {
    if (!canSend) return;
    onSend();
    requestAnimationFrame(() => scrollToBottom('smooth'));
  };

  return (
    <aside
      className={cn(
        urCard(
          `flex ${CHAT_SHELL_HEIGHT} flex-col overflow-hidden p-0 min-[1320px]:sticky min-[1320px]:top-3`
        ),
        className
      )}
    >
      <header className="shrink-0 border-b border-border px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Auction Chat</h2>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Users className="size-3.5" />
            {participantsCount} Participants
          </span>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-3 touch-pan-y [-webkit-overflow-scrolling:touch]"
          role="log"
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
                const isLead = Boolean(
                  currentLeadUserId && m.userId === currentLeadUserId
                );
                const isBidMsg = /placed a bid|placing a bid/i.test(m.message);

                return (
                  <div key={m.id} className="flex gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                      {getUserInitials(m.userName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold">
                          {m.userName}
                        </span>
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
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {showJumpToBottom ? (
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex justify-center px-3">
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
    </aside>
  );
}
