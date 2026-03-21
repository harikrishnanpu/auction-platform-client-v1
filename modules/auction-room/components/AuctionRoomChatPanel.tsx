'use client';

import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatAuctionDateTime } from '@/lib/auction-utils';
import { cn } from '@/lib/utils';

import type { IAuctionRoomChatMessage } from '../realtime/useAuctionRoomSocket';

type AuctionRoomChatPanelProps = {
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  dense?: boolean;
};

export function AuctionRoomChatPanel({
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  dense = false,
}: AuctionRoomChatPanelProps) {
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  return (
    <Card
      className={cn(
        'border-border/60 bg-card/70 shadow-sm',
        dense ? 'rounded-xl' : 'rounded-2xl'
      )}
    >
      <CardHeader className={cn('pb-2', dense && 'pb-1')}>
        <CardTitle
          className={cn('font-semibold', dense ? 'text-sm' : 'text-base')}
        >
          Room chat
        </CardTitle>
        <CardDescription className={dense ? 'text-xs' : undefined}>
          Messages are visible to everyone in this auction
        </CardDescription>
      </CardHeader>
      <CardContent className={cn('space-y-4', dense && 'space-y-3')}>
        <div
          className={cn(
            'space-y-2 overflow-y-auto rounded-xl border border-border/60 bg-muted/15',
            'max-h-56 p-3',
            dense && 'space-y-1 rounded-lg p-2 max-h-[70vh]'
          )}
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <p
              className={cn(
                'py-6 text-center text-sm text-muted-foreground',
                dense && 'py-4 text-xs'
              )}
            >
              Say hello — the conversation starts here.
            </p>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={cn(
                  'rounded-lg border border-border/40 bg-background/70 shadow-sm',
                  dense && 'rounded-md px-2 py-1',
                  !dense && 'px-3 py-2'
                )}
              >
                <header className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'font-semibold text-foreground',
                      dense ? 'text-[11px]' : 'text-xs'
                    )}
                  >
                    {m.userName}
                  </span>
                  <time
                    className="text-[10px] text-muted-foreground"
                    dateTime={m.createdAt}
                  >
                    {formatAuctionDateTime(m.createdAt)}
                  </time>
                </header>
                <p
                  className={cn(
                    'whitespace-pre-wrap leading-relaxed text-foreground',
                    dense ? 'mt-0.5 text-xs' : 'mt-1 text-sm'
                  )}
                >
                  {m.message}
                </p>
              </article>
            ))
          )}
        </div>

        <div
          className={cn(
            'flex flex-col gap-2 sm:flex-row sm:items-end',
            dense && 'gap-2'
          )}
        >
          <Textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Write a message…"
            disabled={!canInteract}
            className={cn(
              'flex-1 resize-none rounded-xl border-border/80',
              dense ? 'min-h-[64px] rounded-lg text-sm' : 'min-h-[88px]',
              'focus-visible:ring-primary/30'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
          />
          <Button
            type="button"
            size={dense ? 'icon-sm' : 'lg'}
            className={cn(
              'shrink-0 rounded-xl',
              dense
                ? 'h-10 w-10 sm:h-10 sm:w-10 sm:px-0'
                : 'h-11 sm:h-[88px] sm:w-14 sm:px-0'
            )}
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            <SendHorizontal className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
