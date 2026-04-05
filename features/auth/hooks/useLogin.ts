'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ZodLoginFormValues, loginSchema } from '../schemes/login-from.schema';
import { loginAction } from '@/actions/auth/auth.actions';
import useUserStore from '@/store/user.store';

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ZodLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'one@gmail.com',
      password: 'Hari@123',
    },
  });

  const onSubmit = async (data: ZodLoginFormValues) => {
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
      return;
    }

    router.replace('/home');
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
