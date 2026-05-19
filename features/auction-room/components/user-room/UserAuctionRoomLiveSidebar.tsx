'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  MapPin,
  Mic,
  MicOff,
  Send,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type {
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
  RemoteStreamItem,
} from '@/types/auctionRoom.types';

import { getUserInitials } from '../seller-room/seller-room-helpers';
import { UserAuctionRoomChatFeed } from './UserAuctionRoomChatFeed';
import { urCard } from './user-room-ui';

type TabId = 'chat' | 'participants';

type UserAuctionRoomLiveSidebarProps = {
  sellerId?: string | null;
  sellerName: string;
  heroImageUrl?: string | null;
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  participants: IAuctionRoomParticipant[];
  watchingCount: number;
  currentLeadUserId?: string | null;
  remoteStreams: RemoteStreamItem[];
  className?: string;
};

function AudioWaveform({ active }: { active: boolean }) {
  const bars = [3, 5, 8, 4, 7, 5, 9, 4, 6, 3];
  return (
    <div className="flex h-6 items-end justify-center gap-0.5" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn(
            'w-0.5 rounded-full bg-brand-500 transition-all',
            active && 'animate-pulse'
          )}
          style={{ height: `${h * 2}px`, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

export function UserAuctionRoomLiveSidebar({
  sellerId,
  sellerName,
  heroImageUrl,
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  participants,
  watchingCount,
  currentLeadUserId,
  remoteStreams,
  className,
}: UserAuctionRoomLiveSidebarProps) {
  const [tab, setTab] = useState<TabId>('chat');
  const hasAudio = remoteStreams.some((s) => s.kind === 'audio');
  const hasVideo = remoteStreams.some((s) => s.kind === 'video');
  const participantCount = participants.length;

  const sortedParticipants = useMemo(
    () =>
      [...participants].sort(
        (a, b) =>
          new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      ),
    [participants]
  );

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  return (
    <aside
      className={cn(
        urCard(
          'flex h-[min(480px,62vh)] max-h-[min(480px,62vh)] flex-col overflow-hidden p-0 min-[1320px]:sticky min-[1320px]:top-3 min-[1320px]:h-[calc(100dvh-5.5rem)] min-[1320px]:max-h-[calc(100dvh-5.5rem)]'
        ),
        className
      )}
    >
      <div className="shrink-0 border-b border-border p-3.5">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Auction Host
        </p>
        <div className="flex items-start gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-brand-100">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-sm font-bold text-brand-700">
                {getUserInitials(sellerName)}
              </span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{sellerName}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              Online
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  hasAudio
                    ? 'border-brand-200 bg-brand-50 text-brand-600'
                    : 'border-border bg-muted/40 text-muted-foreground'
                )}
                title={hasAudio ? 'Microphone on' : 'Microphone off'}
              >
                {hasAudio ? (
                  <Mic className="size-3.5" />
                ) : (
                  <MicOff className="size-3.5" />
                )}
              </span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  hasVideo
                    ? 'border-brand-200 bg-brand-50 text-brand-600'
                    : 'border-border bg-muted/40 text-muted-foreground'
                )}
                title={hasVideo ? 'Camera on' : 'Camera off'}
              >
                {hasVideo ? (
                  <Video className="size-3.5" />
                ) : (
                  <VideoOff className="size-3.5" />
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-muted-foreground">
              {hasAudio ? 'Audio is ON' : 'Audio is OFF'}
            </p>
            <AudioWaveform active={hasAudio} />
          </div>
        </div>
      </div>

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
          <ul className="absolute inset-0 overflow-y-auto overscroll-y-contain px-3 py-2 touch-pan-y [-webkit-overflow-scrolling:touch]">
            {sortedParticipants.length === 0 ? (
              <li className="py-8 text-center text-xs text-muted-foreground">
                No participants yet
              </li>
            ) : (
              sortedParticipants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2.5 border-b border-border/60 py-2.5 last:border-0"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {getUserInitials(p.userName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{p.userName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Joined {formatAuctionDateTime(p.joinedAt)}
                    </p>
                  </div>
                  {p.userId === sellerId ? (
                    <span className="shrink-0 rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">
                      Host
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {tab === 'chat' ? (
        <footer className="border-t border-border p-3">
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
