'use client';

import { useForm } from 'react-hook-form';
import {
  changePasswordSchema,
  ZodChangePasswordValues,
} from '../schems/change-password.schema';
import { toast } from 'sonner';
import { RESET_PASSWORD_MESSAGES } from '@/constants/reset/password.constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordAction } from '@/actions/auth/auth.actions';

export const useChangePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ZodChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ZodChangePasswordValues) => {
    const response = await changePasswordAction({
      ...data,
      token: token as string,
    });

    if (response.success) {
      toast.success(RESET_PASSWORD_MESSAGES.SUCCESS);
      router.push('/login');
    } else {
      setError('root', {
        type: 'manual',
        message: response.error || 'Failed to reset password',
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
};
