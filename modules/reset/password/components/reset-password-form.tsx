'use client';

import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useResetPassword } from '../hooks/useResetPassword';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthFormCard } from '@/components/auth/authFormCard';

export function ResetPasswordForm() {
  const { register, handleSubmit, errors, isSubmitting, isSent, onSubmit } =
    useResetPassword();

  if (isSent) {
    return (
      <AuthFormCard>
        <CardHeader className="text-center pb-2 pt-8 md:pt-10 px-8 md:px-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Mail className="h-6 w-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Check your inbox
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 pt-1">
            We sent a password reset link to your email. Open it to choose a new
            password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-8 md:pb-10 px-8 md:px-10 pt-2">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 dark:border-gray-700"
            asChild
          >
            <Link href="/login">Back to login</Link>
          </Button>
        </CardFooter>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard>
      <CardHeader className="text-center pb-6 pt-8 md:pt-10 px-8 md:px-10">
        <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Forgot password
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10 pb-8 md:pb-10">
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
                autoComplete="email"
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black" />
            ) : (
              <>
                <span>Send reset link</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-bold text-black dark:text-white hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </AuthFormCard>
  );
}
