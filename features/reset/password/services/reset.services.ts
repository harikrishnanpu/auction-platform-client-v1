import api from '@/lib/axios';

export const resetServices = {
  async forgotPassword(data: { email: string }) {
    const response = await api.post<{ success: boolean; message: string }>(
      `/user/auth/forgot-password`,
      data
    );
    return response.data;
  },

  async resetPassword(data: {
    newPassword: string;
    token: string;
    email: string;
  }) {
    const response = await api.post<{ success: boolean; message: string }>(
      `/user/auth/reset-password`,
      data
    );
    return response.data;
  },
};
