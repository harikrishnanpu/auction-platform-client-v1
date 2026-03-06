'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { LoginFormValues, loginSchema } from '../schemes/login-from.schema';
import { loginAction } from '@/actions/auth/auth.actions';
import { getErrorMessage } from '@/utils/get-app-error';

export const useLogin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginAction(data);

      if (res.success) {
        router.push(
          `/email?email=${encodeURIComponent(data.email)}&autoSend=0`
        );
        return;
      }

      if (!res.success) {
        setError('root', {
          message: res.error || 'Login failed',
        });
        return;
      }

      router.replace('/home');
      router.refresh();
    } catch (err) {
      setError('root', {
        message: getErrorMessage(err) || 'Something went wrong',
      });
      console.log(err);
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
