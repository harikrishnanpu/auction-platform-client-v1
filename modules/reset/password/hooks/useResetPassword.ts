import { useForm } from 'react-hook-form';
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from '../schems/forget-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { forgotPasswordAction } from '@/actions/auth/auth.actions';

export const useResetPassword = () => {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const response = await forgotPasswordAction({ email: data.email });
      if (!response.success) {
        setError('email', {
          type: 'manual',
          message: response.error || 'Failed to send reset link',
        });
        return;
      }

      setIsSent(true);
      return response;
    } catch (err) {
      console.log('Forgot Password Error:', err);
      setError('email', {
        type: 'manual',
        message: typeof err === 'string' ? err : 'Failed to send reset link',
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isSent,
  };
};
