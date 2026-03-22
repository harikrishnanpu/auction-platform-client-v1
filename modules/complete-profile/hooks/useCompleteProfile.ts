'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  completeProfileSchema,
  ZodCompleteProfileValues,
} from '../schemes/complete-profile-schema';
import { toast } from 'sonner';
import { completeProfileAction } from '@/actions/auth/auth.actions';
import { getErrorMessage } from '@/utils/get-app-error';

export const useCompleteProfile = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ZodCompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: ZodCompleteProfileValues) => {
    const response = await completeProfileAction(data);

    if (response.success && response.data) {
      toast.success('Profile updated successfully');

      if (!response.data.isVerified) {
        router.replace(`/email?email=${response.data.email}&autoSend=1`);
        return;
      }

      router.replace('/home');
    } else {
      setError('root', {
        message: response.error || 'Failed to update profile',
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
