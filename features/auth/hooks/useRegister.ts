import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemes/register-schema';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { useState } from 'react';
import { ApiErrorResponse } from '@/shared/types/api-error.types';
import { AxiosError } from 'axios';

export const useRegister = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: 'one',
      lastName: 'ine',
      email: 'one@gmail.com',
      phone: '6789837940',
      address: 'sample address',
      password: 'Hari123',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);

      const res = await authService.register(data);

      if (!res.success) {
        setError('root', { message: res.message || 'Registration failed' });
        setIsSubmitting(false);
        return;
      }

      router.replace(`/email?email=${data.email}`);
      router.refresh();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;

      console.log(err.response?.data.message);

      setError('root', {
        message: err.response?.data.message as string,
      });

      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setError,
    onSubmit,
  };
};
