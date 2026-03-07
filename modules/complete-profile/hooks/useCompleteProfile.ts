'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  completeProfileSchema,
  CompleteProfileFormValues,
} from '../schemes/complete-profile-schema';
import { toast } from 'sonner';
import { completeProfileAction } from '@/actions/auth/auth.actions';
import { getErrorMessage } from '@/utils/get-app-error';

export const useCompleteProfile = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: CompleteProfileFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await completeProfileAction(data);

      if (response.success && response.data) {
        toast.success('Profile updated successfully');

        if (!response.data.isVerified) {
          router.replace(`/email?email=${response.data.email}&autoSend=1`);
          return;
        }

        router.replace('/home');
      } else {
        form.setError('root', {
          message: response.error || 'Failed to update profile',
        });
      }
    } catch (error: unknown) {
      console.log('Update profile error:', error);
      form.setError('root', {
        message:
          getErrorMessage(error) || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};
