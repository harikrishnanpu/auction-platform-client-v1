import Image from 'next/image';

import { cn } from '@/lib/utils';

/** 5:4 frame — balanced for product shots; crisp cover crop. */
export function AuctionCardCover({
  title,
  imageUrl,
  showImage,
  className,
}: {
  title: string;
  imageUrl: string;
  showImage: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative aspect-5/4 w-full overflow-hidden bg-muted/40',
        className
      )}
    >
      {showImage ? (
        <>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            quality={90}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10"
            aria-hidden
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/25">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
            No image
          </span>
        </div>
      )}
    </div>
  );
}
