'use client';

import { useState } from 'react';
import { Flag, Send, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';

import { AuctionRoomParticipantsTab } from '../AuctionRoomParticipantsTab';
import { UserAuctionRoomChatFeed } from './UserAuctionRoomChatFeed';
import { UserAuctionRoomParticipantsReportModal } from './UserAuctionRoomParticipantsReportModal';
import { urCard } from './user-room-ui';

type TabId = 'chat' | 'participants';

type ReportParticipantInput = {
  targetedUserId: string;
  reason: string;
  category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
  level: 'LOW' | 'MEDIUM' | 'CRITICAL';
};

type UserAuctionRoomLiveSidebarProps = {
  sellerId?: string | null;
  heroImageUrl?: string | null;
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  participants: IAuctionRoomParticipant[];
  currentLeadUserId?: string | null;
  currentUserId?: string | null;
  canReportAuction?: boolean;
  onReportAuction?: () => void;
  onReportParticipant?: (input: ReportParticipantInput) => Promise<void>;
  className?: string;
};

export function UserAuctionRoomLiveSidebar({
  sellerId,
  heroImageUrl,
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  participants,
  currentLeadUserId,
  currentUserId,
  canReportAuction = false,
  onReportAuction,
  onReportParticipant,
  className,
}: UserAuctionRoomLiveSidebarProps) {
  const [tab, setTab] = useState<TabId>('chat');
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const participantCount = participants.length;
  const canReportParticipants = Boolean(onReportParticipant);

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  return (
    <>
      <aside
        className={cn(
          urCard(
            'flex h-[min(480px,62vh)] max-h-[min(480px,62vh)] flex-col overflow-hidden p-0 min-[1320px]:sticky min-[1320px]:top-3 min-[1320px]:h-[calc(100dvh-5.5rem)] min-[1320px]:max-h-[calc(100dvh-5.5rem)]'
          ),
          className
        )}
      >
        {canReportAuction || canReportParticipants ? (
          <div className="shrink-0 space-y-2 border-b border-border p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Safety
            </p>
            <div className="flex flex-col gap-2">
              {canReportAuction && onReportAuction ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  onClick={onReportAuction}
                >
                  <Flag className="size-3.5 shrink-0" />
                  Report auction
                </Button>
              ) : null}
              {canReportParticipants ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  onClick={() => setParticipantsModalOpen(true)}
                >
                  <Users className="size-3.5 shrink-0" />
                  Report participants
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

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
              hostBadge="Host"
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

      {onReportParticipant ? (
        <UserAuctionRoomParticipantsReportModal
          open={participantsModalOpen}
          onOpenChange={setParticipantsModalOpen}
          participants={participants}
          sellerId={sellerId}
          currentUserId={currentUserId}
          onReportParticipant={onReportParticipant}
        />
      ) : null}
    </>
  );
}
