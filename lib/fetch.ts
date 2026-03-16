import { ApiResponse } from '@/types/api.index';
import { getErrorMessage } from '@/utils/get-app-error';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const apiFetch = async <T>(
  url: string,
  options: RequestInit,
  cookies: ReadonlyRequestCookies,
  cache: RequestCache = 'no-store'
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: cookies.toString(),
      },
      body: options.body ?? null,
      credentials: 'include',
      cache: cache,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error),
    };
  }
};
