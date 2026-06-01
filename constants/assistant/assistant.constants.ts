export type AssistantMood = 'greeting' | 'ready' | 'thinking' | 'chatOpen';

export const ASSISTANT_IMAGES: Record<AssistantMood, string> = {
  greeting: '/images/assistant/assistant-1.png',
  ready: '/images/assistant/assistant-2.png',
  thinking: '/images/assistant/assistant-3.png',
  chatOpen: '/images/assistant/assistant-4.png',
};

export const ASSISTANT_IMAGE_KEYS: AssistantMood[] = [
  'greeting',
  'ready',
  'thinking',
  'chatOpen',
];

export const ASSISTANT_MOOD_CYCLE: AssistantMood[] = [
  'greeting',
  'ready',
  'thinking',
];

export const ASSISTANT_HEAD_IMAGES = [
  '/images/assistant/assist-head1.png',
  '/images/assistant/assist-head2.png',
] as const;

export const AI_AGENT_NOT_IN_PLAN_MESSAGE =
  'AI assistant is not included in your current subscription plan. Upgrade your plan to use chat.';

export type AssistantChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
