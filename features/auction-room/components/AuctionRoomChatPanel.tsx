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
import { formatAuctionDateTime } from '@/utils/auction-utils';

import type { IAuctionRoomChatMessage } from '../../../socket/useAuctionRoomSocket';

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

  if (dense) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background pt-10">
        <header className="shrink-0 border-b border-border/60 px-3 py-2 pr-10">
          <CardTitle className="text-xs font-semibold">Room chat</CardTitle>
          <CardDescription className="text-[10px] leading-tight">
            Visible to everyone in this auction
          </CardDescription>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-2 py-2"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <p className="py-6 text-center text-[11px] text-muted-foreground">
              No messages yet.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="rounded-md border border-border/40 bg-muted/15 px-2 py-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-semibold text-foreground">
                      {m.userName}
                    </span>
                    <time
                      className="shrink-0 text-[9px] text-muted-foreground"
                      dateTime={m.createdAt}
                    >
                      {formatAuctionDateTime(m.createdAt)}
                    </time>
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-[11px] leading-snug text-foreground">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-border/60 bg-background/95 p-2 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex gap-2">
            <Textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Message…"
              disabled={!canInteract}
              rows={2}
              className="min-h-[52px] flex-1 resize-none rounded-md border-border/80 py-2 text-xs focus-visible:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) onSend();
                }
              }}
            />
            <Button
              type="button"
              variant="default"
              className="h-[52px] w-10 shrink-0 rounded-md px-0"
              onClick={onSend}
              disabled={!canSend}
              aria-label="Send message"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Room chat</CardTitle>
        <CardDescription>
          Messages are visible to everyone in this auction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border/60 bg-muted/15 p-3"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Say hello — the conversation starts here.
            </p>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className="rounded-lg border border-border/40 bg-background/70 px-3 py-2 shadow-sm"
              >
                <header className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {m.userName}
                  </span>
                  <time
                    className="text-[10px] text-muted-foreground"
                    dateTime={m.createdAt}
                  >
                    {formatAuctionDateTime(m.createdAt)}
                  </time>
                </header>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.message}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Write a message…"
            disabled={!canInteract}
            className="min-h-[88px] flex-1 resize-none rounded-xl border-border/80 focus-visible:ring-primary/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
          />
          <Button
            type="button"
            size="lg"
            className="h-11 shrink-0 rounded-xl sm:h-[88px] sm:w-14 sm:px-0"
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
