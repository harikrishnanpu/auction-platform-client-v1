'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { useChangePassword } from '../hooks/useChangePassword';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthFormCard } from '@/components/auth/authFormCard';

export function ChangePasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useChangePassword();

  if (!token) {
    return (
      <AuthFormCard className="border-red-200/80 dark:border-red-900/50">
        <CardHeader className="text-center pb-2 pt-8 md:pt-10 px-8 md:px-10">
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Invalid or expired link
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 pt-2">
            This reset link is missing or no longer valid. Request a new one to
            continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 md:px-10 pb-8 md:pb-10">
          <Button
            className="w-full rounded-xl bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6"
            asChild
          >
            <Link href="/reset/password">Request new link</Link>
          </Button>
        </CardContent>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard>
      <CardHeader className="text-center pb-6 pt-8 md:pt-10 px-8 md:px-10">
        <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          New password
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Choose a strong password you haven&apos;t used elsewhere.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10 pb-8 md:pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
              New password
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
              </div>
              <Input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="block w-full pl-11 pr-12 py-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
              Confirm password
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
              </div>
              <Input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="block w-full pl-11 pr-4 py-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none shadow-sm"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 p-3 rounded-xl font-medium">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black" />
            ) : (
              <>
                <span>Update password</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/login"
            className="font-bold text-black dark:text-white hover:underline transition-all"
          >
            Back to login
          </Link>
        </p>
      </CardContent>
    </AuthFormCard>
  );
}
