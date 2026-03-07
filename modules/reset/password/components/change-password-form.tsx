'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useChangePassword } from '../hooks/useChangePassword';

export function ChangePasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useChangePassword();

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-200 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        {' '}
        <h1 className="text-2xl font-bold mb-4 text-red-500">Invalid Link</h1>
        <p className="text-muted-foreground mb-6">
          This password reset link is invalid or missing required information.
        </p>
        <a
          href="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          Request a new link
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-200 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      {' '}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground mb-6 shadow-lg">
          <Lock className="text-background w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-3xl font-bold mb-3 text-foreground">
          Reset Password
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          Enter your new password below.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
            New Password
          </label>
          <div className="relative group">
            <input
              {...register('newPassword')}
              type={showPassword ? 'text' : 'password'}
              className="block w-full px-4 py-4 bg-background/50 border-none rounded-xl text-foreground placeholder-muted-foreground/50 focus:ring-2 focus:ring-primary focus:shadow-lg transition-all shadow-inner outline-none"
              placeholder="******"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <input
              {...register('confirmPassword')}
              type="password"
              className="block w-full px-4 py-4 bg-background/50 border-none rounded-xl text-foreground placeholder-muted-foreground/50 focus:ring-2 focus:ring-primary focus:shadow-lg transition-all shadow-inner outline-none"
              placeholder="******"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          {errors.root && (
            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded">
              {errors.root.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium py-4 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
          ) : (
            <>
              Change Password
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
