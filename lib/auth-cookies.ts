import { env } from '@/env';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const AUTH_COOKIE_NAMES = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = (
  cookieStore: ReadonlyRequestCookies,
  tokens: AuthTokens
): void => {
  cookieStore.set({
    name: AUTH_COOKIE_NAMES.accessToken,
    value: tokens.accessToken,
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: env.AUTH_ACCESS_TOKEN_MAX_AGE,
    domain: env.COOKIE_DOMAIN,
  });

  cookieStore.set({
    name: AUTH_COOKIE_NAMES.refreshToken,
    value: tokens.refreshToken,
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: env.AUTH_REFRESH_TOKEN_MAX_AGE,
    domain: env.COOKIE_DOMAIN,
  });
};

export const clearAuthCookies = (cookieStore: ReadonlyRequestCookies): void => {
  cookieStore.delete({
    name: AUTH_COOKIE_NAMES.accessToken,
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    domain: env.COOKIE_DOMAIN,
  });

  cookieStore.delete({
    name: AUTH_COOKIE_NAMES.refreshToken,
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    domain: env.COOKIE_DOMAIN,
  });
};
