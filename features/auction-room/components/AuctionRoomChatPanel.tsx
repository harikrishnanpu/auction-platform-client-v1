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
import { cn } from '@/lib/utils';
import { formatAuctionDateTime } from '@/utils/auction-utils';

import type { IAuctionRoomChatMessage } from '@/types/auctionRoom.types';

import { arBtnPrimary, arCardCanvas, arType } from '../lib/auction-room-design';

type AuctionRoomChatPanelProps = {
  messages: IAuctionRoomChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  canInteract: boolean;
  dense?: boolean;
  className?: string;
};

export function AuctionRoomChatPanel({
  messages,
  draft,
  onDraftChange,
  onSend,
  canInteract,
  dense = false,
  className,
}: AuctionRoomChatPanelProps) {
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && canInteract;

  if (dense) {
    return (
      <div className={cn('flex h-full min-h-0 flex-col bg-card', className)}>
        <header className="shrink-0 border-b border-border px-4 pb-3 pt-4">
          <p className={arType.sectionLabel}>Room chat</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Visible to everyone in this auction.
          </p>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No messages yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2 dark:bg-muted/15"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {m.userName}
                    </span>
                    <time
                      className="shrink-0 text-[11px] text-muted-foreground"
                      dateTime={m.createdAt}
                    >
                      {formatAuctionDateTime(m.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-border bg-card p-3">
          <div className="flex gap-2">
            <Textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Write a message…"
              disabled={!canInteract}
              rows={2}
              className="min-h-[48px] flex-1 resize-none rounded-md border-border py-2 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) onSend();
                }
              }}
            />
            <Button
              type="button"
              className={arBtnPrimary('h-[48px] w-11 min-w-11 shrink-0 px-0')}
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
    <section className={arCardCanvas('overflow-hidden')}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="border-b border-[#e5e7eb] px-6 py-5 dark:border-white/10">
          <CardTitle className={arType.cardTitle}>Room chat</CardTitle>
          <CardDescription className="text-sm text-[#6b7280]">
            Messages are visible to everyone in this auction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6">
          <div
            className="max-h-64 space-y-3 overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-white/10 dark:bg-zinc-900/50"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#6b7280]">
                Say hello — the conversation starts here.
              </p>
            ) : (
              messages.map((m) => (
                <article
                  key={m.id}
                  className="rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-zinc-950"
                >
                  <header className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-[#111111] dark:text-zinc-50">
                      {m.userName}
                    </span>
                    <time
                      className="text-[13px] text-[#6b7280]"
                      dateTime={m.createdAt}
                    >
                      {formatAuctionDateTime(m.createdAt)}
                    </time>
                  </header>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#374151] dark:text-zinc-300">
                    {m.message}
                  </p>
                </article>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Write a message…"
              disabled={!canInteract}
              className="min-h-[88px] flex-1 resize-none rounded-[12px] border-[#e5e7eb] focus-visible:ring-[#111111]/15 dark:border-white/15"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) onSend();
                }
              }}
            />
            <Button
              type="button"
              className={cn(
                arBtnPrimary(
                  'h-11 shrink-0 px-6 sm:h-[88px] sm:w-14 sm:px-0 sm:py-0'
                ),
                'sm:min-h-[88px]'
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
    </section>
  );
}
