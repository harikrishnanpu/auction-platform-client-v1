'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="overflow-hidden rounded-lg border border-border/60 bg-black/80">
      <div className="border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
        {title}
      </div>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className="h-56 w-full bg-black object-cover"
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
    <section className="space-y-2 rounded-xl border border-border/50 bg-card/60 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Live stream</h3>
        <span className="text-xs text-muted-foreground">
          {videoStreams.length} remote video
        </span>
      </div>

      {audioStreams.length > 0 ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAudioControl}
        >
          {!isAudioStarted
            ? 'Play Audio'
            : isAudioMuted
              ? 'Unmute Audio'
              : 'Mute Audio'}
        </Button>
      ) : null}

      {isHostProducer && localStream ? (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onToggleLocalAudio}
          >
            {isLocalAudioEnabled ? 'Turn Mic Off' : 'Turn Mic On'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onToggleLocalVideo}
          >
            {isLocalVideoEnabled ? 'Turn Camera Off' : 'Turn Camera On'}
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {localStream && isHostProducer ? (
          <StreamVideo stream={localStream} muted title="Your stream (host)" />
        ) : null}

        {videoStreams.map((item) => (
          <StreamVideo
            key={item.producerId}
            stream={item.stream}
            muted
            title={`Host stream ${item.producerId.slice(0, 6)}`}
          />
        ))}
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
