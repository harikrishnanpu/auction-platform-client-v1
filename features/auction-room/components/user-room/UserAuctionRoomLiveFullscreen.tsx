'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Minimize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { UserAuctionRoomChatFeed } from './UserAuctionRoomChatFeed';

type UserAuctionRoomLiveFullscreenProps = {
  open: boolean;
  onClose: () => void;
  videoStream: MediaStream | null;
  isLive: boolean;
  watchingCount: number;
  isPlaying: boolean;
  isMuted: boolean;
  hasAudio: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  messages: IAuctionRoomChatMessage[];
  chatDraft: string;
  onChatDraftChange: (value: string) => void;
  onSendChat: () => void;
  canInteract: boolean;
  hostUserId?: string | null;
  currentLeadUserId?: string | null;
  heroImageUrl?: string | null;
  auctionTitle?: string;
};

function FullscreenVideo({
  stream,
  paused,
}: {
  stream: MediaStream;
  paused: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.srcObject = stream;
    if (!paused) void video.play().catch(() => undefined);
    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className="size-full object-contain"
    />
  );
}

export function UserAuctionRoomLiveFullscreen({
  open,
  onClose,
  videoStream,
  isLive,
  watchingCount,
  isPlaying,
  isMuted,
  hasAudio,
  onTogglePlay,
  onToggleMute,
  messages,
  chatDraft,
  onChatDraftChange,
  onSendChat,
  canInteract,
  hostUserId,
  currentLeadUserId,
  heroImageUrl,
  auctionTitle,
}: UserAuctionRoomLiveFullscreenProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950 sm:flex-row">
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="absolute inset-0 bg-black">
          {videoStream ? (
            <FullscreenVideo stream={videoStream} paused={!isPlaying} />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400">
              <Play className="size-12 opacity-50" />
              <p className="text-sm">Waiting for host video…</p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

        <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
                Live
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <Eye className="size-3.5" />
              {watchingCount} Watching
            </span>
            {auctionTitle ? (
              <span className="hidden max-w-[min(40vw,320px)] truncate text-sm font-medium text-white/90 sm:inline">
                {auctionTitle}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="pointer-events-auto size-9 shrink-0 rounded-lg text-white hover:bg-white/15 hover:text-white"
            aria-label="Exit fullscreen"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="relative z-10 mt-auto flex items-center justify-between gap-2 px-4 pb-4 pt-8">
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex size-9 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              disabled={!hasAudio}
              className="flex size-9 items-center justify-center rounded-lg text-white/90 hover:bg-white/10 disabled:opacity-40"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </button>
            {isLive ? (
              <span className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                LIVE
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
          >
            <Minimize2 className="size-4" /> Exit
          </button>
        </div>
      </div>

      <aside className="flex h-[min(42vh,360px)] min-h-0 w-full shrink-0 flex-col overflow-hidden border-t border-white/10 bg-card sm:h-full sm:max-w-[380px] sm:border-l sm:border-t-0">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Auction Chat</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
            aria-label="Close chat"
          >
            <X className="size-4" />
          </button>
        </header>
        <UserAuctionRoomChatFeed
          messages={messages}
          hostUserId={hostUserId}
          currentLeadUserId={currentLeadUserId}
          heroImageUrl={heroImageUrl}
          className="min-h-0 flex-1 overflow-hidden"
          draft={chatDraft}
          onDraftChange={onChatDraftChange}
          onSend={onSendChat}
          canInteract={canInteract}
          showInput
        />
      </aside>
    </div>,
    document.body
  );
}
