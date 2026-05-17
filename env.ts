import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_URL: z.url(),
    AUTH_ACCESS_TOKEN_MAX_AGE: z.coerce.number().positive(),
    AUTH_REFRESH_TOKEN_MAX_AGE: z.coerce.number().positive(),
    COOKIE_SECURE: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true'),
    COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']),
    COOKIE_DOMAIN: z
      .string()
      .optional()
      .transform((value) => {
        if (!value?.trim()) return undefined;
        const trimmed = value.trim();
        return trimmed;
      }),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_SOCKET_URL: z.url(),
    NEXT_PUBLIC_BASE_URL: z.url(),
  },
  runtimeEnv: {
    API_URL: process.env.API_URL,
    AUTH_ACCESS_TOKEN_MAX_AGE: process.env.AUTH_ACCESS_TOKEN_MAX_AGE,
    AUTH_REFRESH_TOKEN_MAX_AGE: process.env.AUTH_REFRESH_TOKEN_MAX_AGE,
    COOKIE_SECURE: process.env.COOKIE_SECURE,
    COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
