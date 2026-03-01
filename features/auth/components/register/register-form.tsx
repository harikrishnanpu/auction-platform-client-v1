'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { SiginWithGoogleButton } from '@/components/ui/buttons/google-signin';
import { useRegister } from '../../hooks/useRegister';
import { useSearchParams } from 'next/navigation';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useRegister();

  const params = useSearchParams();
  const error = params.get('error');
  console.log(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            {...register('firstName')}
            className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm outline-none"
            id="firstName"
            placeholder="first name"
            type="text"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            {...register('lastName')}
            className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm outline-none"
            id="lastName"
            placeholder="lastname"
            type="text"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          {...register('email')}
          className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm outline-none"
          id="email"
          placeholder="example@example.com"
          type="email"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          {...register('phone')}
          className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm outline-none"
          id="phone"
          placeholder="+1 234 567 890"
          type="tel"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
          htmlFor="address"
        >
          Address
        </label>
        <input
          {...register('address')}
          className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm outline-none"
          id="address"
          placeholder="address line"
          type="text"
          aria-invalid={!!errors.address}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            className="block w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm pr-10 outline-none"
            id="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            aria-invalid={!!errors.password}
          />
          <button
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              {...register('terms')}
              className="h-4 w-4 text-primary border-input rounded focus:ring-primary"
              id="terms"
              type="checkbox"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              className="font-medium text-muted-foreground"
              htmlFor="terms"
            >
              I agree to the{' '}
              <Link
                href="#"
                className="text-foreground underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-muted-foreground transition-all"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="text-foreground underline decoration-muted-foreground/30 underline-offset-4 hover:decoration-muted-foreground transition-all"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-xs ml-1">{errors.terms.message}</p>
        )}
      </div>

      {(errors.root || error) && (
        <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 p-3 rounded-xl mb-4 font-medium animate-in fade-in slide-in-from-top-2">
          {errors.root?.message || error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-input"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <SiginWithGoogleButton
            handleClick={() => {
              const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              window.location.href = `${backendUrl}/auth/google?callBack=register`;
            }}
          />
        </div>
      </div>
    </form>
  );
}
