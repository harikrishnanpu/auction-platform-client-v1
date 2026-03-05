'use client';

import { authService } from '@/features/auth/services/auth.service';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useUserStore from '@/store/user.store';
import { toast } from 'sonner';
import { ApiErrorResponse } from '@/shared/types/api-error.types';
import { AxiosError } from 'axios';

export const useVerify = ({
  email,
  autoSend,
}: {
  email: string;
  autoSend?: boolean;
}) => {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const RESEND_INTERVALS = [20, 40, 60, 120];
  const TIMER_KEY = `verify_timer_${email}`;
  const autoSentRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    if (!email) {
      setError('Email is missing from the verification request.');
      return;
    }

    const stored = localStorage.getItem(TIMER_KEY);
    let targetTime: number;
    let count = 0;

    if (stored) {
      const parsed = JSON.parse(stored);
      targetTime = parsed.expiresAt;
      count = parsed.count;
      setResendCount(count);
    } else {
      const duration = RESEND_INTERVALS[0];
      targetTime = Date.now() + duration * 1000;
      localStorage.setItem(
        TIMER_KEY,
        JSON.stringify({ expiresAt: targetTime, count: 0 })
      );
      setResendCount(0);
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(diff);
      return diff;
    };

    const initialDiff = calculateTimeLeft();
    if (initialDiff <= 0) {
      setTimeLeft(0);
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, TIMER_KEY]);

  useEffect(() => {
    if (!autoSend || !email || autoSentRef.current) return;
    autoSentRef.current = true;

    authService
      .resendVerificationCode(email)
      .then(() => {
        setError(null);
        setSuccess('A verification code has been sent to your email.');
        toast.success('Verification OTP sent');
      })
      .catch((err: unknown) => {
        const error = err as AxiosError<ApiErrorResponse>;
        const msg =
          error.response?.data?.message || 'Failed to send verification OTP.';
        setError(msg);
        toast.error(msg);
      });
  }, [autoSend, email]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    if (!email) {
      setError('Email address is missing.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await authService.verifyEmail(email, otp);

      if (!res.success) {
        setError(res.message || 'Verification failed. Please check your code.');
        toast.error(
          res.message || 'Verification failed. Please check your code.'
        );
        setIsVerifying(false);
        return;
      } else {
        const verifiedUser = res.data?.user;
        if (verifiedUser) {
          setUser(verifiedUser);
        }
        setSuccess('Email verified successfully! Redirecting...');
        toast.success('Email verified successfully!');
        localStorage.removeItem(TIMER_KEY);
        setIsVerifying(false);
        router.replace('/home');
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      const msg =
        error.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      setError(msg);
      toast.error(msg);
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authService.resendVerificationCode(email);

      const nextCount = resendCount + 1;
      const MathMin = Math.min(nextCount, RESEND_INTERVALS.length - 1);
      const duration = RESEND_INTERVALS[MathMin];
      const targetTime = Date.now() + duration * 1000;

      localStorage.setItem(
        TIMER_KEY,
        JSON.stringify({
          expiresAt: targetTime,
          count: nextCount,
        })
      );

      setResendCount(nextCount);
      setTimeLeft(duration);

      setError(null);
      setSuccess('A new verification code has been sent.');
      toast.success('OTP resent successfully!');
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      const msg = error.response?.data?.message || 'Failed to resend OTP.';
      setError(msg);
      toast.error(msg);
    }
  };

  return {
    handleVerify,
    handleResend,
    otp,
    setOtp,
    isVerifying,
    timeLeft,
    error,
    success,
    isMounted,
  };
};
