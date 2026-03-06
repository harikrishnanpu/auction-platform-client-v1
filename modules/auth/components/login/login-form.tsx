'use client';

import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../../hooks/useLogin';
import { useState } from 'react';
import { SiginWithGoogleButton } from '@/components/ui/buttons/google-signin';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, onSubmit, isSubmitting } = useLogin();

  const params = useSearchParams();
  const error = params.get('error');

  return (
    <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden fade-in relative z-10">
      <CardHeader className="text-center pb-6 pt-8 md:pt-10">
        <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
              Email
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
              </div>
              <Input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="block w-full pl-11 pr-4 py-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none shadow-sm"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Password
              </Label>
              <Link
                href="/reset/password"
                className="text-xs font-semibold text-black dark:text-white hover:underline transition-all"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
              </div>
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="block w-full pl-11 pr-12 py-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {(errors.root || error) && (
            <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 p-3 rounded-xl mb-4 font-medium animate-in fade-in slide-in-from-top-2">
              {errors.root?.message || error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 rounded-lg font-medium text-xs uppercase tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-2">
          <SiginWithGoogleButton
            handleClick={() => {
              const backendUrl = process.env.NEXT_PUBLIC_API_URL;
              window.location.href = `${backendUrl}/auth/google?callBack=login`;
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="px-8 md:px-10 pb-8 flex justify-center border-t border-gray-100 dark:border-gray-800/50 pt-6 mt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-bold text-black dark:text-white hover:underline transition-all hover:text-blue-600 dark:hover:text-blue-400"
          >
            Create Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
