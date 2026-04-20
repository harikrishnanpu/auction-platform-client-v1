'use client';

import { useEffect, useRef } from 'react';

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
}: {
  isLiveRoom: boolean;
  isHostProducer: boolean;
  localStream: MediaStream | null;
  remoteStreams: Array<{
    producerId: string;
    stream: MediaStream;
    kind: 'audio' | 'video';
  }>;
}) {
  if (!isLiveRoom) return null;

  const videoStreams = remoteStreams.filter((item) => item.kind === 'video');
  const audioStreams = remoteStreams.filter((item) => item.kind === 'audio');

  return (
    <section className="space-y-2 rounded-xl border border-border/50 bg-card/60 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Live stream</h3>
        <span className="text-xs text-muted-foreground">
          {videoStreams.length} remote video
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {localStream && isHostProducer ? (
          <StreamVideo stream={localStream} muted title="Your stream (host)" />
        ) : null}

        {videoStreams.map((item) => (
          <StreamVideo
            key={item.producerId}
            stream={item.stream}
            title={`Host stream ${item.producerId.slice(0, 6)}`}
          />
        ))}
      </div>

      {/* Audio-only producers are consumed and played without a visible tile. */}
      {audioStreams.map((item) => (
        <audio
          key={item.producerId}
          autoPlay
          ref={(el) => {
            if (el) el.srcObject = item.stream;
          }}
        />
      ))}
    </section>
  );
}
