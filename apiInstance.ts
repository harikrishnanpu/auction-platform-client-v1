import { env } from './env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/verify-credentials',
    sendVerificationCode: '/auth/send-verification-code',
    me: '/auth/me',
    completeProfile: '/auth/complete-profile',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    changePassword: '/auth/change-password',
  },

  user: {
    profile: '/user/profile',
    getAvatarUploadUrl: '/user/get-avatar-upload-url',
  },
} as const;

export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
