'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemes/register-form.schema';
import { registerAction } from '@/actions/auth/auth.actions';
import { getErrorMessage } from '@/utils/get-app-error';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
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
      const res = await registerAction(data);

      if (!res.success) {
        setError('root', { message: res.error || 'Registration failed' });
        return;
      }

      router.replace(`/email?email=${data.email}`);
    } catch (error) {
      console.log(error);
      setError('root', {
        message: getErrorMessage(error),
      });
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
