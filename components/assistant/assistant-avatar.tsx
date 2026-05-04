import Image from 'next/image';

import { cn } from '@/lib/utils';

import {
  ASSISTANT_IMAGE_KEYS,
  ASSISTANT_IMAGES,
  type AssistantMood,
} from './assistant-constants';

type AssistantAvatarProps = {
  mood: AssistantMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'fab';
  priority?: boolean;
  alt?: string;
};

const sizeClass: Record<NonNullable<AssistantAvatarProps['size']>, string> = {
  sm: 'h-24 min-h-24 w-20 min-w-20',
  md: 'h-48 min-h-48 w-36 min-w-36',
  lg: 'h-56 min-h-56 w-44 min-w-44',
  fab: 'h-full min-h-0 w-full min-w-0',
};

export function AssistantAvatar({
  mood,
  className,
  size = 'md',
  priority,
  alt = 'HammerDown assistant',
}: AssistantAvatarProps) {
  const sizesAttr =
    size === 'fab'
      ? '(max-width: 640px) 176px, 224px'
      : size === 'sm'
        ? '80px'
        : '(max-width: 768px) 144px, 200px';

  return (
    <div
      className={cn(
        'relative flex min-h-0 min-w-0 items-end justify-center',
        sizeClass[size],
        className
      )}
    >
      {ASSISTANT_IMAGE_KEYS.map((key) => {
        const active = key === mood;
        return (
          <Image
            key={key}
            src={ASSISTANT_IMAGES[key]}
            alt={active ? alt : ''}
            width={200}
            height={320}
            unoptimized
            priority={priority && active}
            aria-hidden={!active}
            sizes={sizesAttr}
            className={cn(
              'absolute inset-0 h-full w-full object-contain object-bottom select-none pointer-events-none transition-opacity duration-700 ease-in-out motion-reduce:transition-none motion-reduce:duration-0',
              active ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
          />
        );
      })}
    </div>
  );
}
