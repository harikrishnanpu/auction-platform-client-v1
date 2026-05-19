'use client';

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { getUserInitials } from './seller-room-helpers';
import { srCard } from './seller-room-ui';

type SellerAuctionRoomChatProps = {
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  currentLeadUserId?: string | null;
  className?: string;
};

function isSystemMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('auction started') ||
    lower.includes('joined the auction') ||
    lower.includes('auction ended') ||
    lower.includes('auction paused') ||
    lower.includes('auction resumed') ||
    lower.startsWith('placed a bid')
  );
}

export function SellerAuctionRoomChat({
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  currentLeadUserId,
  className,
}: SellerAuctionRoomChatProps) {
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  return (
    <aside
      className={cn(
        srCard(
          'flex min-h-[min(420px,58vh)] flex-col p-0 min-[1320px]:sticky min-[1320px]:top-3 min-[1320px]:max-h-[calc(100dvh-5.5rem)] min-[1320px]:min-h-[calc(100dvh-5.5rem)]'
        ),
        className
      )}
    >
      <header className="border-b border-border px-3.5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Room Chat</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Visible to everyone in this auction.
        </p>
      </header>

      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          messages.map((m) => {
            const system = isSystemMessage(m.message);
            const isLead = Boolean(
              currentLeadUserId && m.userId === currentLeadUserId
            );

            if (system) {
              return (
                <p
                  key={m.id}
                  className="text-center text-xs text-muted-foreground"
                >
                  {m.message}
                </p>
              );
            }

            return (
              <div key={m.id} className="flex gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                  {getUserInitials(m.userName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {m.userName}
                    </span>
                    {isLead ? (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        Current Lead
                      </span>
                    ) : null}
                    <time
                      className="text-[11px] text-muted-foreground"
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

      <footer className="border-t border-border p-3">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Type a message..."
            disabled={!canInteract}
            className="h-9 flex-1 text-sm rounded-xl border-border"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            className="size-9 shrink-0 rounded-full bg-brand-600 hover:bg-brand-700"
            disabled={!canSend}
            onClick={onSend}
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </footer>
    </aside>
  );
}
