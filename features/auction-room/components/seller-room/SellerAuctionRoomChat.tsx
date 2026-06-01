'use client';

import { useState } from 'react';
import { Send, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';

import { AuctionRoomParticipantsTab } from '../AuctionRoomParticipantsTab';
import { UserAuctionRoomChatFeed } from '../user-room/UserAuctionRoomChatFeed';
import { srCard } from './seller-room-ui';

type TabId = 'chat' | 'participants';

const CHAT_SHELL_HEIGHT =
  'h-[min(420px,58vh)] max-h-[min(420px,58vh)] min-[1320px]:h-[calc(100dvh-5.5rem)] min-[1320px]:max-h-[calc(100dvh-5.5rem)]';

type SellerAuctionRoomChatProps = {
  sellerId?: string | null;
  heroImageUrl?: string | null;
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  participants: IAuctionRoomParticipant[];
  currentLeadUserId?: string | null;
  className?: string;
};

export function SellerAuctionRoomChat({
  sellerId,
  heroImageUrl,
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  participants,
  currentLeadUserId,
  className,
}: SellerAuctionRoomChatProps) {
  const [tab, setTab] = useState<TabId>('chat');
  const participantCount = participants.length;

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  return (
    <aside
      className={cn(
        srCard(
          `flex ${CHAT_SHELL_HEIGHT} flex-col overflow-hidden p-0 min-[1320px]:sticky min-[1320px]:top-3`
        ),
        className
      )}
    >
      <div className="flex shrink-0 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('chat')}
          className={cn(
            'flex-1 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors',
            tab === 'chat'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setTab('participants')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors',
            tab === 'participants'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Users className="size-3.5" />
          Participants ({participantCount})
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {tab === 'chat' ? (
          <UserAuctionRoomChatFeed
            messages={messages}
            hostUserId={sellerId}
            currentLeadUserId={currentLeadUserId}
            heroImageUrl={heroImageUrl}
          />
        ) : (
          <AuctionRoomParticipantsTab
            participants={participants}
            hostUserId={sellerId}
            hostBadge="You"
            hostIsSelf
          />
        )}
      </div>

      {tab === 'chat' ? (
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
      ) : null}
    </aside>
  );
}
