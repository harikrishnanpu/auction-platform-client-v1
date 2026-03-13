import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { LoginFormValues } from '@/modules/auth/schemes/login-from.schema';
import { RegisterFormValues } from '@/modules/auth/schemes/register-form.schema';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/types/api.index';
import { getErrorMessage } from '@/utils/get-app-error';
import { UserInfo } from '@/types/user.type';

const getSession = async (): Promise<ApiResponse<UserInfo>> => {
  try {
    const cookieStorage = await cookies();

    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.me), {
      headers: {
        Cookie: cookieStorage.toString(),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (res.status === 403 && body?.message === 'ACCOUNT_BLOCKED') {
        cookieStorage.delete('accessToken');
        cookieStorage.delete('refreshToken');
        return { success: false, data: null, error: 'ACCOUNT_BLOCKED' };
      }
      return {
        success: false,
        data: null,
        error: body?.message ?? getErrorMessage(new Error('Session failed')),
      };
    }

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
): Promise<
  ApiResponse<{ user: UserInfo; accessToken: string; refreshToken: string }>
> => {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        body?.message ?? body?.error ?? 'Login failed. Please try again.';
      throw new Error(message);
    }

    const response = await res.json();
    (await cookies()).set('accessToken', response.data.accessToken);
    (await cookies()).set('refreshToken', response.data.refreshToken);
    return { success: true, data: response.data };
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
}): Promise<
  ApiResponse<{ user: UserInfo; accessToken: string; refreshToken: string }>
> => {
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
    (await cookies()).set('accessToken', response.data.accessToken);
    (await cookies()).set('refreshToken', response.data.refreshToken);
    return response;
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const completeProfile = async (data: {
  phone: string;
  address: string;
}): Promise<ApiResponse<UserInfo>> => {
  try {
    const cookieStorage = await cookies();
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.completeProfile), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStorage.toString(),
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

const logout = async (): Promise<ApiResponse<null>> => {
  try {
    (await cookies()).delete('accessToken');
    (await cookies()).delete('refreshToken');
    return { success: true, data: null };
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const forgotPassword = async (data: {
  email: string;
}): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.forgotPassword), {
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

const changePassword = async (data: {
  newPassword: string;
  token: string;
}): Promise<ApiResponse<null>> => {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.auth.changePassword), {
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
  completeProfile,
  logout,
  forgotPassword,
  changePassword,
};
