'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

const NEAR_BOTTOM_PX = 72;

export function useChatAutoScroll(
  messageCount: number,
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const endRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevCountRef = useRef(messageCount);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [unreadWhileScrolledUp, setUnreadWhileScrolledUp] = useState(0);

  const checkNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= NEAR_BOTTOM_PX;
  }, [scrollRef]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior });
      } else {
        endRef.current?.scrollIntoView({ behavior, block: 'end' });
      }
      isNearBottomRef.current = true;
      setShowJumpToBottom(false);
      setUnreadWhileScrolledUp(0);
    },
    [scrollRef]
  );

  const onScroll = useCallback(() => {
    const near = checkNearBottom();
    isNearBottomRef.current = near;
    if (near) {
      setShowJumpToBottom(false);
      setUnreadWhileScrolledUp(0);
    } else {
      setShowJumpToBottom(true);
    }
  }, [checkNearBottom]);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = messageCount;

    if (messageCount === 0) return;

    if (messageCount > prev) {
      if (isNearBottomRef.current) {
        requestAnimationFrame(() => scrollToBottom('smooth'));
      } else {
        setUnreadWhileScrolledUp((n) => n + (messageCount - prev));
        setShowJumpToBottom(true);
      }
    }
  }, [messageCount, scrollToBottom]);

  useEffect(() => {
    if (messageCount > 0) {
      requestAnimationFrame(() => scrollToBottom('auto'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial layout only
  }, []);

  return {
    endRef,
    showJumpToBottom,
    unreadWhileScrolledUp,
    onScroll,
    scrollToBottom,
  };
}
