import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ChatMessageBubbleProps = {
  role: 'user' | 'assistant';
  children: ReactNode;
  className?: string;
};

export function ChatMessageBubble({
  role,
  children,
  className,
}: ChatMessageBubbleProps) {
  return (
    <div
      className={cn(
        'max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm',
        role === 'user'
          ? 'ml-auto rounded-br-md bg-primary text-primary-foreground'
          : 'mr-auto rounded-bl-md border border-border/70 bg-card/90 text-foreground backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
