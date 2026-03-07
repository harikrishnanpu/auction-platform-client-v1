'use client';

import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useResetPassword } from '../hooks/useResetPassword';
import Link from 'next/link';

export function ResetPasswordForm() {
  const { register, handleSubmit, errors, isSubmitting, isSent, onSubmit } =
    useResetPassword();

  if (isSent) {
    return (
      <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/20 dark:border-white/10 relative overflow-hidden animate-in fade-in slide-in-from-left-8 duration-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6 shadow-lg">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-foreground">
            Check your inbox
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            We have sent a password reset link to your email. Please click the
            link to reset your password.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/20 dark:border-white/10 relative overflow-hidden animate-in fade-in slide-in-from-left-8 duration-500">
      <div className="absolute top-6 right-6 text-xs italic text-muted-foreground opacity-70">
        security check
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground mb-6 shadow-lg">
          <Lock className="text-background w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Recover Password
        </h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xs mx-auto">
          {"Enter your email and we'll send you a secure link to reset it."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-muted-foreground group-focus-within:text-foreground transition-colors w-5 h-5" />
            </div>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="name@example.com"
              className="block w-full pl-11 pr-4 py-4 bg-background/50 border-none rounded-xl text-foreground placeholder-muted-foreground/50 focus:ring-2 focus:ring-primary focus:shadow-lg transition-all shadow-inner outline-none"
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.email.message}
            </p>
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
              Send Reset Link
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Remember your password?</span>
          <a
            href="/login"
            className="font-bold text-foreground hover:underline decoration-2 underline-offset-4"
          >
            Login Now
          </a>
        </div>
      </div>
    </div>
  );
}
