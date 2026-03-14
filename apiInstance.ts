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
    getAvatarUploadUrl: '/user/generate-avatar-upload-url',
    editProfile: '/user/edit-profile',
    sendProfileChangePasswordOtp: '/user/send-profile-change-password-otp',
    changeProfilePassword: '/user/change-profile-password',
    editProfileSendOtp: '/user/edit-profile-send-otp',
    updateAvatar: '/user/update-avatar-url',
    getKycUploadUrl: '/user/get-kyc-upload-url',
  },

  kyc: {
    getKycStatus: '/kyc/get-kyc-status',
    submitKyc: '/kyc/submit-kyc',
    generateKycUploadUrl: '/kyc/get-kyc-upload-url',
    updateKyc: '/kyc/update-kyc',
  },

  auction: {
    create: '/auction',
    getSellerAuctions: '/auction',
    getBrowse: '/auction/browse',
    getAuctionForSeller: (id: string) => `/auction/seller/${id}`,
    getAuctionForUser: (id: string) => `/auction/user/${id}`,
    placeBid: (id: string) => `/auction/${id}/bid`,
    update: (id: string) => `/auction/${id}`,
    publish: (id: string) => `/auction/${id}/publish`,
    end: (id: string) => `/auction/${id}/end`,
    generateUploadUrl: '/auction/upload-url',
  },

  admin: {
    getAllUsers: '/admin/users',
    blockUser: '/admin/users/block',
    getAdminUser: '/admin/users',
    getAllSellers: '/admin/sellers',
    getAdminSeller: '/admin/sellers',
    approveSellerKyc: '/admin/sellers',
    rejectSellerKyc: '/admin/sellers',
  },
} as const;

export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export function buildQuery(params: object) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  return query.toString();
}
