'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Captions,
  Eye,
  Maximize,
  Pause,
  Play,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type {
  IAuctionRoomChatMessage,
  RemoteStreamItem,
} from '@/types/auctionRoom.types';

import { UserAuctionRoomLiveFullscreen } from './UserAuctionRoomLiveFullscreen';
import { urCard } from './user-room-ui';

type UserAuctionRoomLiveStreamProps = {
  remoteStreams: RemoteStreamItem[];
  localStream?: MediaStream | null;
  isHostProducer?: boolean;
  watchingCount: number;
  isLive: boolean;
  className?: string;
  messages?: IAuctionRoomChatMessage[];
  chatDraft?: string;
  onChatDraftChange?: (value: string) => void;
  onSendChat?: () => void;
  canInteract?: boolean;
  hostUserId?: string | null;
  currentLeadUserId?: string | null;
  heroImageUrl?: string | null;
  auctionTitle?: string;
};

function LiveVideo({
  stream,
  muted = true,
  paused = false,
  className,
}: {
  stream: MediaStream;
  muted?: boolean;
  paused?: boolean;
  className?: string;
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
      muted={muted}
      className={cn('size-full object-cover', className)}
    />
  );
}

export function UserAuctionRoomLiveStream({
  remoteStreams,
  localStream = null,
  isHostProducer = false,
  watchingCount,
  isLive,
  className,
  messages = [],
  chatDraft = '',
  onChatDraftChange,
  onSendChat,
  canInteract = false,
  hostUserId,
  currentLeadUserId,
  heroImageUrl,
  auctionTitle,
}: UserAuctionRoomLiveStreamProps) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoStreams = remoteStreams.filter((s) => s.kind === 'video');
  const audioStreams = remoteStreams.filter((s) => s.kind === 'audio');
  const primaryVideo =
    (isHostProducer && localStream ? localStream : null) ??
    videoStreams[0]?.stream ??
    null;

  const hasAudio = audioStreams.length > 0;
  const chatEnabled = Boolean(onChatDraftChange && onSendChat);

  const toggleMute = () => {
    const players = [...audioRefs.current.values()];
    if (!audioStarted && players.length > 0) {
      Promise.allSettled(players.map((p) => p.play())).then(() => {
        setAudioStarted(true);
        players.forEach((p) => {
          p.muted = false;
        });
        setIsMuted(false);
      });
      return;
    }
    const next = !isMuted;
    players.forEach((p) => {
      p.muted = next;
    });
    setIsMuted(next);
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  const openFullscreen = () => {
    if (chatEnabled) setIsFullscreen(true);
  };

  return (
    <>
      <div
        className={cn(
          urCard('relative overflow-hidden p-0'),
          'aspect-video w-full bg-zinc-900',
          className
        )}
      >
        <div className="absolute inset-0">
          {primaryVideo ? (
            <LiveVideo stream={primaryVideo} muted paused={!isPlaying} />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400">
              <Play className="size-10 opacity-50" />
              <p className="text-sm">Waiting for host video…</p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Eye className="size-3.5" />
            {watchingCount} Watching
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-8 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              disabled={!hasAudio}
              className="flex size-8 items-center justify-center rounded-lg text-white/90 hover:bg-white/10 disabled:opacity-40"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>
            {isLive ? (
              <span className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                LIVE
              </span>
            ) : null}
          </div>
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
              aria-label="Captions"
            >
              <Captions className="size-4" />
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </button>
            <button
              type="button"
              onClick={openFullscreen}
              disabled={!chatEnabled}
              className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Fullscreen with chat"
            >
              <Maximize className="size-4" />
            </button>
          </div>
        </div>

        {audioStreams.map((item) => (
          <audio
            key={item.producerId}
            autoPlay
            playsInline
            ref={(el) => {
              if (!el) {
                audioRefs.current.delete(item.producerId);
                return;
              }
              audioRefs.current.set(item.producerId, el);
              el.srcObject = item.stream;
              el.muted = !audioStarted || isMuted;
            }}
          />
        ))}
      </div>

      {chatEnabled ? (
        <UserAuctionRoomLiveFullscreen
          open={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          videoStream={primaryVideo}
          isLive={isLive}
          watchingCount={watchingCount}
          isPlaying={isPlaying}
          isMuted={isMuted}
          hasAudio={hasAudio}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          messages={messages}
          chatDraft={chatDraft}
          onChatDraftChange={onChatDraftChange!}
          onSendChat={onSendChat!}
          canInteract={canInteract}
          hostUserId={hostUserId}
          currentLeadUserId={currentLeadUserId}
          heroImageUrl={heroImageUrl}
          auctionTitle={auctionTitle}
        />
      ) : null}
    </>
  );
}
