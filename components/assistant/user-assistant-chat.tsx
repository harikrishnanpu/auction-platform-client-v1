'use client';

import { useCallback, useEffect, useId, useState } from 'react';

import useUserStore from '@/store/user.store';
import { UserRole } from '@/types/user.type';

import { AssistantChatPanel } from './assistant-chat-panel';
import {
  ASSISTANT_MOOD_CYCLE,
  type AssistantChatMessage,
  type AssistantMood,
} from './assistant-constants';
import { AssistantAvatar } from './assistant-avatar';
import { getMockAssistantReply } from './mock-assistant-reply';

const IDLE_POSE_MS = 2800;

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function UserAssistantChat() {
  const user = useUserStore((s) => s.user);
  const titleId = useId();
  const isAdmin = user?.roles?.includes(UserRole.ADMIN) ?? false;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  /** Cycles greeting → ready → thinking when the chat is closed */
  const [idlePoseIndex, setIdlePoseIndex] = useState(0);

  const fabMood: AssistantMood =
    ASSISTANT_MOOD_CYCLE[idlePoseIndex % ASSISTANT_MOOD_CYCLE.length];

  useEffect(() => {
    if (open) return;
    const id = window.setInterval(() => {
      setIdlePoseIndex((i) => (i + 1) % ASSISTANT_MOOD_CYCLE.length);
    }, IDLE_POSE_MS);
    return () => window.clearInterval(id);
  }, [open]);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || isThinking) return;

    const userMsg: AssistantChatMessage = {
      id: nextId(),
      role: 'user',
      content: text,
    };
    setDraft('');
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const delay = 650 + Math.floor(Math.random() * 400);
    window.setTimeout(() => {
      const reply: AssistantChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: getMockAssistantReply(text),
      };
      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, delay);
  }, [draft, isThinking]);

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
        onSend={send}
        isThinking={isThinking}
      />

      {!open ? (
        <div className="fixed bottom-4 right-4 z-55 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
          <div
            className="mb-1 max-w-[min(220px,calc(100vw-5rem))] rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur-md dark:bg-primary/20"
            id={titleId}
          >
            <span className="font-medium text-primary">Need help?</span> Chat
            with our assistant anytime.
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex h-54 w-44 shrink-0 cursor-pointer items-end justify-center bg-transparent p-0 shadow-none outline-none transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-56"
            aria-expanded={false}
            aria-controls="assistant-dialog"
            aria-describedby={titleId}
            aria-label="Open assistant chat"
          >
            <AssistantAvatar mood={fabMood} size="fab" className="size-full" />
          </button>
        </div>
      ) : null}
    </>
  );
}
