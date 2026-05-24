'use client';

import Image from 'next/image';
import { Minimize2 } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';

import useUserStore from '@/store/user.store';
import { UserRole } from '@/types/user.type';
import { cn } from '@/lib/utils';

import { AssistantChatPanel } from './assistant-chat-panel';
import {
  AI_AGENT_NOT_IN_PLAN_MESSAGE,
  ASSISTANT_HEAD_IMAGES,
  ASSISTANT_MOOD_CYCLE,
  type AssistantChatMessage,
  type AssistantMood,
} from './assistant-constants';
import { AssistantAvatar } from './assistant-avatar';
import { useAssistantChatSocket } from '@/socket/useAssistantChatSocket';

const IDLE_POSE_MS = 2800;

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isSubscriptionAiError(error?: string): boolean {
  if (!error) return false;
  return (
    error.includes('not included in your current subscription') ||
    error.includes('AI assistant')
  );
}

export function UserAssistantChat() {
  const user = useUserStore((s) => s.user);
  const titleId = useId();
  const isAdmin = user?.roles?.includes(UserRole.ADMIN) ?? false;

  const [open, setOpen] = useState(false);
  const [fabMinimized, setFabMinimized] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [idlePoseIndex, setIdlePoseIndex] = useState(0);
  const [headPoseIndex, setHeadPoseIndex] = useState(0);

  const fabMood: AssistantMood =
    ASSISTANT_MOOD_CYCLE[idlePoseIndex % ASSISTANT_MOOD_CYCLE.length];

  const { askAgent, connected } = useAssistantChatSocket();

  useEffect(() => {
    if (open || fabMinimized) return;
    const id = window.setInterval(() => {
      setIdlePoseIndex((i) => (i + 1) % ASSISTANT_MOOD_CYCLE.length);
    }, IDLE_POSE_MS);
    return () => window.clearInterval(id);
  }, [open, fabMinimized]);

  useEffect(() => {
    if (open || !fabMinimized) return;
    const id = window.setInterval(() => {
      setHeadPoseIndex((i) => (i + 1) % ASSISTANT_HEAD_IMAGES.length);
    }, IDLE_POSE_MS);
    return () => window.clearInterval(id);
  }, [open, fabMinimized]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || isThinking) return;

    const userMsg: AssistantChatMessage = {
      id: nextId(),
      role: 'user',
      content: text,
    };
    setDraft('');
    setMessages((prev) => [...prev, userMsg]);

    const lastMessages = messages.slice(-5).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setIsThinking(true);

    const ack = await askAgent(text, lastMessages);

    setIsThinking(false);

    const response = ack.data?.response;
    if (!ack.success || response == null) {
      const err = isSubscriptionAiError(ack.error)
        ? AI_AGENT_NOT_IN_PLAN_MESSAGE
        : (ack.error ?? 'Could not reach the assistant. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: err,
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: 'assistant',
        content: response,
      },
    ]);
  }, [draft, isThinking, askAgent, messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!user || isAdmin) return null;

  return (
    <>
      <AssistantChatPanel
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => void send()}
        isThinking={isThinking}
        disabled={!connected}
      />

      {!open ? (
        <div className="fixed bottom-4 right-4 z-55 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
          {fabMinimized ? (
            <div
              className="mb-1 max-w-[min(200px,calc(100vw-5rem))] rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur-md"
              id={titleId}
            >
              <p className="font-medium text-foreground">Assistant</p>
              <button
                type="button"
                className="mt-1.5 block text-[11px] font-semibold text-primary underline-offset-2 hover:underline"
                onClick={() => setFabMinimized(false)}
                aria-label="Show full assistant"
              >
                Show full
              </button>
            </div>
          ) : (
            <div
              className="mb-1 max-w-[min(200px,calc(100vw-5rem))] rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur-md dark:bg-primary/20"
              id={titleId}
            >
              <p className="font-medium text-primary">Need help?</p>
            </div>
          )}
          <div className="flex flex-row-reverse flex-wrap items-end justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                'relative shrink-0 cursor-pointer bg-transparent p-0 shadow-none outline-none transition-[transform,width,height] duration-300 ease-out',
                'hover:scale-[1.03] active:scale-[0.98]',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                fabMinimized
                  ? 'size-14 overflow-hidden rounded-full border-2 border-primary/40 bg-card shadow-lg ring-2 ring-background'
                  : 'relative flex h-54 w-44 items-end justify-center sm:h-56'
              )}
              aria-expanded={false}
              aria-controls="assistant-dialog"
              aria-describedby={titleId}
              aria-label="Open assistant chat"
            >
              {fabMinimized ? (
                <>
                  {ASSISTANT_HEAD_IMAGES.map((src, i) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={160}
                      height={160}
                      unoptimized
                      aria-hidden
                      className={cn(
                        'pointer-events-none absolute left-1/2 top-1/2 size-[135%] max-w-none -translate-x-1/2 -translate-y-[46%] rounded-full object-cover object-[50%_12%] transition-opacity duration-500 ease-in-out motion-reduce:transition-none',
                        i === headPoseIndex % ASSISTANT_HEAD_IMAGES.length
                          ? 'z-10 opacity-100'
                          : 'z-0 opacity-0'
                      )}
                    />
                  ))}
                </>
              ) : (
                <AssistantAvatar
                  mood={fabMood}
                  size="fab"
                  className="size-full"
                />
              )}
            </button>

            {!fabMinimized ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 shrink-0 rounded-full border border-border/80 bg-background/95 px-3 text-xs font-semibold shadow-md backdrop-blur-sm hover:bg-muted/90"
                onClick={() => setFabMinimized(true)}
                aria-label="Shrink assistant to head icon"
              >
                <Minimize2 className="mr-1 size-3.5" aria-hidden />
                Hide
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
