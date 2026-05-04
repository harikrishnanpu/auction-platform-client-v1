'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { AssistantAvatar } from './assistant-avatar';
import type { AssistantChatMessage } from './assistant-constants';
import { ChatMessageBubble } from './chat-message-bubble';

type AssistantChatPanelProps = {
  open: boolean;
  onClose: () => void;
  messages: AssistantChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  isThinking: boolean;
  disabled?: boolean;
};

export function AssistantChatPanel({
  open,
  onClose,
  messages,
  draft,
  onDraftChange,
  onSend,
  isThinking,
  disabled,
}: AssistantChatPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages.length, isThinking]);

  if (!open) return null;

  const showHero = messages.length === 0;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-60 flex max-h-[calc(100vh-1rem)] w-max max-w-[calc(100vw-0.75rem)] items-end gap-1.5 sm:bottom-6 sm:right-6 sm:gap-4'
      )}
    >
      {/* Mascot on the left (assistant-4); slightly smaller than the idle FAB */}
      <div className="flex shrink-0 flex-col justify-end">
        <AssistantAvatar
          mood="chatOpen"
          size="md"
          priority
          className="h-[min(330px,calc(100vh-10rem))] w-24 sm:h-[min(375px,calc(100vh-8rem))] sm:w-36 md:h-[min(395px,calc(100vh-7rem))] md:w-40"
        />
      </div>

      <div
        id="assistant-dialog"
        className={cn(
          'flex max-h-[min(560px,calc(100vh-7rem))] min-h-0 w-[min(calc(100vw-9rem),400px)] min-w-0 shrink flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/85 text-foreground shadow-2xl backdrop-blur-xl dark:bg-slate-950/90 sm:w-[min(400px,calc(100vw-14rem))]'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-chat-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-primary/10 px-3 py-2.5">
          <div className="min-w-0">
            <p
              id="assistant-chat-title"
              className="truncate text-sm font-semibold"
            >
              HammerDown Assistant
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Auction help & account tips
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Close assistant chat"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
          {showHero ? (
            <div className="shrink-0 border-b border-border/40 bg-linear-to-br from-blue-100/80 via-background/90 to-amber-50/60 px-4 py-3 dark:from-primary/15 dark:via-background/80 dark:to-amber-950/20">
              <p className="text-base font-semibold text-foreground">
                Hi there
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">
                I can help with bidding, auctions, payments, and using the
                platform. Ask me anything.
              </p>
            </div>
          ) : (
            <div className="flex shrink-0 items-center border-b border-border/40 bg-muted/30 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                {isThinking ? 'Thinking…' : 'Here if you need more help.'}
              </p>
            </div>
          )}

          <ScrollArea className="min-h-0 flex-1 px-3 py-3">
            <div className="flex flex-col gap-3 pr-1">
              {messages.map((m) => (
                <ChatMessageBubble key={m.id} role={m.role}>
                  <span className="whitespace-pre-wrap wrap-break-word">
                    {m.content}
                  </span>
                </ChatMessageBubble>
              ))}
              {isThinking ? (
                <ChatMessageBubble role="assistant">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span className="inline-flex gap-0.5">
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </span>
                    Preparing a reply…
                  </span>
                </ChatMessageBubble>
              ) : null}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <footer className="shrink-0 border-t border-border/50 bg-background/80 p-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
            >
              <Input
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                placeholder="Ask about auctions, bids, or your account…"
                disabled={disabled || isThinking}
                className="h-11 rounded-full border-border/80 bg-card/80 pr-2 shadow-inner"
                aria-label="Message to assistant"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                className="size-11 shrink-0 rounded-full"
                disabled={disabled || isThinking || !draft.trim()}
                aria-label="Send message"
              >
                <ArrowUp className="size-5" />
              </Button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}
