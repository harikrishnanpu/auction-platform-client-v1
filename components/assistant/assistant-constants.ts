/** Visual state for the mascot — maps to assistant PNGs in /public */
export type AssistantMood = 'greeting' | 'ready' | 'thinking' | 'chatOpen';

export const ASSISTANT_IMAGES: Record<AssistantMood, string> = {
  greeting: '/assistant-1.png',
  ready: '/assistant-2.png',
  thinking: '/assistant-3.png',
  chatOpen: '/assistant-4.png',
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
  '/assist-head1.png',
  '/assist-head2.png',
] as const;

export type AssistantChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
