'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  completeProfileSchema,
  ZodCompleteProfileValues,
} from '../schemes/complete-profile-schema';
import { toast } from 'sonner';
import { COMPLETE_PROFILE_MESSAGES } from '@/constants/profile/constants';
import { completeProfileAction } from '@/actions/auth/auth.actions';
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
      toast.success(COMPLETE_PROFILE_MESSAGES.UPDATED);

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
