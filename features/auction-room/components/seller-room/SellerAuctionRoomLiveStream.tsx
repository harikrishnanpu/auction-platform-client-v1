'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Eye,
  Maximize,
  Mic,
  MicOff,
  Pause,
  Play,
  Video,
  VideoOff,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { SellerAuctionRoomLiveFullscreen } from './SellerAuctionRoomLiveFullscreen';
import { srCard } from './seller-room-ui';

type SellerAuctionRoomLiveStreamProps = {
  localStream: MediaStream | null;
  isHostProducer: boolean;
  isLocalAudioEnabled: boolean;
  isLocalVideoEnabled: boolean;
  onToggleLocalAudio: () => void;
  onToggleLocalVideo: () => void;
  watchingCount: number;
  isLive: boolean;
  className?: string;
  messages?: IAuctionRoomChatMessage[];
  chatDraft?: string;
  onChatDraftChange?: (value: string) => void;
  onSendChat?: () => void;
  canInteract?: boolean;
  sellerId?: string | null;
  currentLeadUserId?: string | null;
  heroImageUrl?: string | null;
  auctionTitle?: string;
};

function HostPreviewVideo({
  stream,
  paused = false,
  className,
}: {
  stream: MediaStream;
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
      muted
      className={cn('size-full object-cover', className)}
    />
  );
}

export function SellerAuctionRoomLiveStream({
  localStream,
  isHostProducer,
  isLocalAudioEnabled,
  isLocalVideoEnabled,
  onToggleLocalAudio,
  onToggleLocalVideo,
  watchingCount,
  isLive,
  className,
  messages = [],
  chatDraft = '',
  onChatDraftChange,
  onSendChat,
  canInteract = false,
  sellerId,
  currentLeadUserId,
  heroImageUrl,
  auctionTitle,
}: SellerAuctionRoomLiveStreamProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const primaryVideo = isHostProducer && localStream ? localStream : null;
  const chatEnabled = Boolean(onChatDraftChange && onSendChat);

  return (
    <>
      <div
        className={cn(
          srCard('relative overflow-hidden p-0'),
          'aspect-video w-full bg-zinc-900',
          className
        )}
      >
        <div className="absolute inset-0">
          {primaryVideo ? (
            <HostPreviewVideo stream={primaryVideo} paused={!isPlaying} />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400">
              <VideoOff className="size-10 opacity-50" />
              <p className="text-sm">Start your camera to broadcast</p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Broadcasting
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
              onClick={() => setIsPlaying((p) => !p)}
              className="flex size-8 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </button>
            {isHostProducer ? (
              <>
                <button
                  type="button"
                  onClick={onToggleLocalAudio}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-lg hover:bg-white/10',
                    isLocalAudioEnabled ? 'text-white' : 'text-white/50'
                  )}
                  aria-label={
                    isLocalAudioEnabled
                      ? 'Mute microphone'
                      : 'Unmute microphone'
                  }
                >
                  {isLocalAudioEnabled ? (
                    <Mic className="size-4" />
                  ) : (
                    <MicOff className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onToggleLocalVideo}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-lg hover:bg-white/10',
                    isLocalVideoEnabled ? 'text-white' : 'text-white/50'
                  )}
                  aria-label={
                    isLocalVideoEnabled ? 'Turn camera off' : 'Turn camera on'
                  }
                >
                  {isLocalVideoEnabled ? (
                    <Video className="size-4" />
                  ) : (
                    <VideoOff className="size-4" />
                  )}
                </button>
              </>
            ) : null}
            {isLive ? (
              <span className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                LIVE
              </span>
            ) : null}
          </div>
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => chatEnabled && setIsFullscreen(true)}
              disabled={!chatEnabled}
              className="flex size-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Fullscreen with chat"
            >
              <Maximize className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {chatEnabled ? (
        <SellerAuctionRoomLiveFullscreen
          open={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          videoStream={primaryVideo}
          isLive={isLive}
          watchingCount={watchingCount}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          isLocalAudioEnabled={isLocalAudioEnabled}
          isLocalVideoEnabled={isLocalVideoEnabled}
          onToggleLocalAudio={onToggleLocalAudio}
          onToggleLocalVideo={onToggleLocalVideo}
          isHostProducer={isHostProducer}
          messages={messages}
          chatDraft={chatDraft}
          onChatDraftChange={onChatDraftChange!}
          onSendChat={onSendChat!}
          canInteract={canInteract}
          sellerId={sellerId}
          currentLeadUserId={currentLeadUserId}
          heroImageUrl={heroImageUrl}
          auctionTitle={auctionTitle}
        />
      ) : null}
    </>
  );
}
