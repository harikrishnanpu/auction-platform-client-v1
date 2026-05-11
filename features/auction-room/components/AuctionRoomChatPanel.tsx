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
      <div className="flex h-full min-h-0 flex-col bg-white dark:bg-zinc-950">
        <header className="shrink-0 border-b border-[#e5e7eb] px-5 pb-4 pt-14 dark:border-white/10">
          <p className={arType.sectionLabel}>Room chat</p>
          <p className="mt-1 text-sm leading-relaxed text-[#374151] dark:text-zinc-300">
            Visible to everyone in this auction.
          </p>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#6b7280]">
              No messages yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="rounded-[12px] border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 dark:border-white/10 dark:bg-zinc-900/80"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-[#111111] dark:text-zinc-50">
                      {m.userName}
                    </span>
                    <time
                      className="shrink-0 text-[13px] text-[#6b7280]"
                      dateTime={m.createdAt}
                    >
                      {formatAuctionDateTime(m.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#374151] dark:text-zinc-300">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#e5e7eb] bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
          <div className="flex gap-2">
            <Textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Write a message…"
              disabled={!canInteract}
              rows={2}
              className="min-h-[52px] flex-1 resize-none rounded-[8px] border-[#e5e7eb] py-2.5 text-sm focus-visible:ring-[#111111]/15 dark:border-white/15"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) onSend();
                }
              }}
            />
            <Button
              type="button"
              className={arBtnPrimary('h-[52px] w-12 min-w-12 shrink-0 px-0')}
              onClick={onSend}
              disabled={!canSend}
              aria-label="Send message"
            >
              <SendHorizontal className="size-5" />
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
