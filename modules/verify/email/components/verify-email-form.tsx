'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useVerify } from '../hooks/useVerify';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import z from 'zod';

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const autoSend = searchParams.get('autoSend') === '1';

  const zodVeifyemail = z.email('Invalid email address');

  const validateEmail = zodVeifyemail.safeParse(emailParam);
  const email = validateEmail.data;

  const {
    handleVerify,
    handleSendVerificationCode,
    otp,
    setOtp,
    isVerifying,
    timeLeft,
    error,
    success,
  } = useVerify({ email: email ?? '', autoSend });

  if (!validateEmail.success) {
    return (
      <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden fade-in relative z-10">
        <CardHeader className="text-center pb-6 pt-8 md:pt-10">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Email not found
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <Link
              href="/login"
              className="hover:underline text-black dark:text-white font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Go back to login
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden fade-in relative z-10">
      <Link
        href="/register"
        className="absolute top-6 left-6 p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white z-20"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="absolute top-8 right-8 text-xs italic opacity-60   text-gray-500 dark:text-gray-400">
        security check
      </div>

      <CardHeader className="text-center pb-6 pt-12 md:pt-14 relative z-0">
        <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {"Verify it's you"}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          {"We've sent a 6-digit code to "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10">
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center mb-4 mt-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isVerifying}
            >
              <InputOTPGroup className="gap-2 sm:gap-3">
                <InputOTPSlot
                  index={0}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
                <InputOTPSlot
                  index={1}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
                <InputOTPSlot
                  index={2}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
                <InputOTPSlot
                  index={3}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
                <InputOTPSlot
                  index={4}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
                <InputOTPSlot
                  index={5}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {(error || success) && (
            <div
              className={`text-sm text-center p-3 rounded-xl mb-4 font-medium animate-in fade-in slide-in-from-top-2 border ${
                error
                  ? 'text-red-500 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/50'
                  : 'text-green-600 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/50'
              }`}
            >
              {error || success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isVerifying || otp.length < 6}
            className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold py-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
          >
            {isVerifying ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
            ) : null}
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>

        {timeLeft !== null && (
          <div className="text-center pt-8">
            {timeLeft > 0 ? (
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Next resend will be available in{' '}
                <span className="text-gray-900 dark:text-white">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {"Didn't receive the code? "}
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="font-semibold hover:underline ml-1 text-black dark:text-white transition-all hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Resend Now
                </button>
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-8 md:px-10 pb-8 flex justify-center border-t border-gray-100 dark:border-gray-800/50 pt-6 mt-2">
        <div className="flex justify-center gap-6 text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>{' '}
            Secure
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>{' '}
            Instant
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>{' '}
            Encrypted
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
