import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { LoginFormValues } from '@/modules/auth/schemes/login-from.schema';
import { RegisterFormValues } from '@/modules/auth/schemes/register-form.schema';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/types/api.index';
import { getErrorMessage } from '@/utils/get-app-error';

const getSession = async (): Promise<ApiResponse<{ userId: string }>> => {
  try {
    const cookieStorage = await cookies();

    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.me), {
      headers: {
        Cookie: cookieStorage.toString(),
      },
      cache: 'no-store',
    });

    const session = await res.json();

    return session;
  } catch (err: unknown) {
    return {
      success: false,
      data: null,
      error: getErrorMessage(err),
    };
  }
};

const login = async (
  data: LoginFormValues
): Promise<ApiResponse<{ userId: string }>> => {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const register = async (
  data: RegisterFormValues
): Promise<ApiResponse<{ userId: string }>> => {
  try {
    const url = buildApiUrl(API_ENDPOINTS.auth.register);
    console.log(url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const response = await res.json();
    console.log(response);
    return response;
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const sendVerificationCode = async (data: {
  otp: string;
  email: string;
  purpose: string;
}): Promise<ApiResponse<{ userId: string }>> => {
  try {
    console.log('send verification code');
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.auth.sendVerificationCode),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      console.log(res);
      const error = await res.json();
      throw new Error(error.message);
    }

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const verifyEmail = async (data: {
  otp: string;
  email: string;
}): Promise<ApiResponse<{ userId: string }>> => {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.verifyEmail), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

export const authService = {
  getSession,
  login,
  register,
  sendVerificationCode,
  verifyEmail,
};
