'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  sendVerificationCodeAction,
  verifyEmailAction,
} from '@/actions/auth/auth.actions';
import { OTP_CHANNEL, OTP_PURPOSE } from '@/constants/auth/otp.constants';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import useUserStore from '@/store/user.store';

const RESEND_INTERVALS = [20, 40, 60, 120];

export const useVerify = ({
  email,
  autoSend,
}: {
  email: string;
  autoSend?: boolean;
}) => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const TIMER_KEY = `verify_timer_${email}`;
  const autoSentRef = useRef(false);
  const { getValue, setValue, removeValue } = useLocalStorage();

  useEffect(() => {
    let targetTime: number;
    let count = 0;

    const storedStr = getValue(TIMER_KEY);
    if (storedStr) {
      const parsed = JSON.parse(storedStr);
      targetTime = parsed.expiresAt;
      count = parsed.count;
    } else {
      const duration = RESEND_INTERVALS[0];
      targetTime = Date.now() + duration * 1000;
      setValue(TIMER_KEY, JSON.stringify({ expiresAt: targetTime, count: 0 }));
    }

    Promise.resolve().then(() => {
      setResendCount(count);
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(diff);
    });

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [email, TIMER_KEY, getValue, setValue]);

  useEffect(() => {
    if (!autoSend || !email || autoSentRef.current) return;
    autoSentRef.current = true;

    sendVerificationCodeAction({
      email,
      purpose: 'verification',
      otp: '',
    }).then((res) => {
      if (res.success) {
        setError(null);
        setSuccess('A verification code has been sent to your email.');
      } else {
        setError(res.error || 'Failed to send verification OTP.');
      }
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
      const res = await verifyEmailAction({
        email,
        otp,
        purpose: OTP_PURPOSE.VERIFY_EMAIL,
        channel: OTP_CHANNEL.EMAIL,
      });

      if (!res.success) {
        setError(res.error || 'Verification failed. Please check your code.');
        setIsVerifying(false);
        return;
      }

      if (res.data?.user) {
        setUser(res.data.user);
      }

      setSuccess('Email verified successfully! Redirecting...');
      removeValue(TIMER_KEY);
      setIsVerifying(false);
      router.replace('/home');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      const res = await sendVerificationCodeAction({
        email,
        purpose: 'verification',
        otp: '',
      });

      if (!res.success) {
        setError(res.error || 'Failed to resend OTP.');
        return;
      }

      const nextCount = resendCount + 1;
      const MathMin = Math.min(nextCount, RESEND_INTERVALS.length - 1);
      const duration = RESEND_INTERVALS[MathMin];
      const targetTime = Date.now() + duration * 1000;

      setValue(
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
    } catch {
      setError('Failed to resend OTP.');
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
  };
};
