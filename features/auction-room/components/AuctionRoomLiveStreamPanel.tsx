'use client';

import { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  arBtnSecondary,
  arCardCanvas,
  arType,
} from '../lib/auction-room-design';

type StreamVideoProps = {
  stream: MediaStream;
  muted?: boolean;
  title: string;
};

function StreamVideo({ stream, muted = false, title }: StreamVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
    ref.current.play().catch(() => {
      console.log('autoplay failed');
    });
  }, [stream]);

  return (
    <div className="overflow-hidden rounded-[8px] border border-border/80 bg-black/90 dark:border-white/10">
      <div className="border-b border-white/10 px-3 py-1.5 text-[11px] font-medium text-zinc-400">
        {title}
      </div>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className="aspect-video h-auto min-h-[160px] w-full bg-black object-cover sm:min-h-[180px]"
      />
    </div>
  );
}

export function AuctionRoomLiveStreamPanel({
  isLiveRoom,
  isHostProducer,
  localStream,
  remoteStreams,
  isLocalAudioEnabled,
  isLocalVideoEnabled,
  onToggleLocalAudio,
  onToggleLocalVideo,
}: {
  isLiveRoom: boolean;
  isHostProducer: boolean;
  localStream: MediaStream | null;
  remoteStreams: Array<{
    producerId: string;
    stream: MediaStream;
    kind: 'audio' | 'video';
  }>;
  isLocalAudioEnabled: boolean;
  isLocalVideoEnabled: boolean;
  onToggleLocalAudio: () => void;
  onToggleLocalVideo: () => void;
}) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  if (!isLiveRoom) return null;

  const videoStreams = remoteStreams.filter((item) => item.kind === 'video');
  const audioStreams = remoteStreams.filter((item) => item.kind === 'audio');

  const handleAudioControl = () => {
    const players = [...audioRefs.current.values()];
    if (players.length === 0) return;

    if (!isAudioStarted) {
      Promise.allSettled(
        players.map((player) => {
          player.muted = false;
          return player.play();
        })
      ).then((results) => {
        const hasSuccess = results.some(
          (result) => result.status === 'fulfilled'
        );
        if (hasSuccess) {
          setIsAudioStarted(true);
          setIsAudioMuted(false);
        }
      });
      return;
    }

    const nextMuted = !isAudioMuted;
    players.forEach((player) => {
      player.muted = nextMuted;
    });
    setIsAudioMuted(nextMuted);
  };

  return (
    <section className={arCardCanvas('overflow-hidden')}>
      <div className="flex flex-col gap-1 border-b border-border/80 bg-muted/30 px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
            <Radio className="size-3.5" aria-hidden />
          </span>
          <div>
            <h3 className={arType.cardTitle}>Live stream</h3>
            <p className={arType.cardDesc}>
              {videoStreams.length} remote feed
              {videoStreams.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-2.5 py-2">
        {audioStreams.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAudioControl}
            className={cn(
              arBtnSecondary('h-8 w-full text-xs sm:w-auto'),
              'px-3'
            )}
          >
            {!isAudioStarted
              ? 'Play audio'
              : isAudioMuted
                ? 'Unmute audio'
                : 'Mute audio'}
          </Button>
        ) : null}

        {isHostProducer && localStream ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleLocalAudio}
              className={arBtnSecondary('h-8 flex-1 text-xs sm:flex-none')}
            >
              {isLocalAudioEnabled ? 'Mic off' : 'Mic on'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleLocalVideo}
              className={arBtnSecondary('h-8 flex-1 text-xs sm:flex-none')}
            >
              {isLocalVideoEnabled ? 'Camera off' : 'Camera on'}
            </Button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {localStream && isHostProducer ? (
            <StreamVideo
              stream={localStream}
              muted
              title="Your stream (host)"
            />
          ) : null}

          {videoStreams.map((item) => (
            <StreamVideo
              key={item.producerId}
              stream={item.stream}
              muted
              title={`Host ${item.producerId.slice(0, 6)}`}
            />
          ))}
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
            el.muted = !isAudioStarted || isAudioMuted;
          }}
        />
      ))}
    </section>
  );
}
