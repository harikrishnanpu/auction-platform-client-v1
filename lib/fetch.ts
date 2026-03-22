import { ApiResponse } from '@/types/api.index';
import { getErrorMessage } from '@/utils/get-app-error';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const apiFetch = async <T>(
  url: string,
  options: RequestInit,
  cookies: ReadonlyRequestCookies,
  cache: RequestCache = 'no-store'
): Promise<ApiResponse<T>> => {
  console.log('OPTIONS', options);

  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Cookie: cookies.toString(),
      },
      body: options.body ?? null,
      credentials: 'include',
      cache: cache,
    });

    if (!response.ok) {
      console.log(response);
      const error = await response.json();
      throw new Error(error.message);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: unknown) {
    console.log('ERROR IN API FETCH', error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error),
    };
  }
};
