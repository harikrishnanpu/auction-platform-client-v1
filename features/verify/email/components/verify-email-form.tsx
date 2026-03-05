'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useVerify } from '../hooks/useVerify';
import useUserStore from '@/store/user.store';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const user = useUserStore((s) => s.user);
  const emailParam = searchParams.get('email');
  const autoSend = searchParams.get('autoSend') === '1';
  const email = (emailParam || user?.email || '').trim();

  const {
    handleVerify,
    handleResend,
    otp,
    setOtp,
    isVerifying,
    timeLeft,
    error,
    success,
    isMounted,
  } = useVerify({ email, autoSend });

  if (!email) {
    return (
      <div className="w-full max-w-lg bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10 mt-2">
          <h1 className="text-sm md:text-base leading-relaxed max-w-xs mx-auto text-gray-600 dark:text-gray-400">
            Email not found
          </h1>
          <Link
            href="/login"
            className="text-sm md:text-base leading-relaxed max-w-xs mx-auto text-gray-600 dark:text-gray-400"
          >
            Go back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-500">
      {/* Back Button */}
      <Link
        href="/register"
        className="absolute top-6 left-6 p-2 hover:bg-black/5 rounded-full transition-colors dark:text-white"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Security Badge */}
      <div className="absolute top-6 right-6 text-xs italic opacity-60 font-serif text-gray-500 dark:text-gray-400">
        security check
      </div>

      <div className="text-center mb-10 mt-2">
        <h1
          className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Verify it&apos;s you
        </h1>
        <p className="text-sm md:text-base leading-relaxed max-w-xs mx-auto text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {email}
          </span>
          .
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isVerifying}
          >
            <InputOTPGroup className="gap-2 sm:gap-4">
              <InputOTPSlot
                index={0}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
              <InputOTPSlot
                index={1}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
              <InputOTPSlot
                index={2}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
              <InputOTPSlot
                index={3}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
              <InputOTPSlot
                index={4}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
              <InputOTPSlot
                index={5}
                className="w-10 h-12 sm:w-12 sm:h-14 text-xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 text-sm text-center bg-green-50 dark:bg-green-900/10 p-2 rounded animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}

        <div className="text-center">
          <Button
            type="submit"
            disabled={isVerifying || otp.length < 6}
            className="w-full sm:w-auto px-10 py-3 uppercase text-sm tracking-wide bg-black text-white hover:bg-[#333333] dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all"
          >
            {isVerifying ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>
      </form>

      {isMounted && timeLeft !== null && (
        <div className="text-center pt-6">
          {timeLeft > 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              Next resend will be available in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Didn&apos;t receive the code?
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold hover:underline ml-1 text-gray-900 dark:text-white"
              >
                Resend Now
              </button>
            </p>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-center gap-6 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Secure
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Instant
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Encrypted
        </div>
      </div>
    </div>
  );
}
