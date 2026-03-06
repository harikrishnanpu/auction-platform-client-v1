'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { LoginFormValues, loginSchema } from '../schemes/login-from.schema';
import { loginAction } from '@/actions/auth/auth.actions';
import { getErrorMessage } from '@/utils/get-app-error';
import useUserStore from '@/store/user.store';

export const useLogin = () => {
  const router = useRouter();

  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'one@gmail.com',
      password: 'Hari123',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginAction(data);

      if (!res.success) {
        setError('root', {
          message: res.error || 'Login failed',
        });
        return;
      }

      if (res.data?.user) {
        setUser(res.data.user);
      }

      if (res.data?.user.isVerified) {
        router.replace('/home');
        return;
      }

      if (!res.data?.user.isProfileCompleted) {
        router.replace('/complete-profile');
        return; // Fixed missing return
      }

      router.replace('/home');
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
