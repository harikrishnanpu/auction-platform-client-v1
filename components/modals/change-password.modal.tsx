'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from '@/features/user/profile/schemes/changeprofilePassword.schema';
import { UserInfo as User, AuthProvider } from '@/types/user.type';
import { toast } from 'sonner';
import { Loader2, Key, AlertCircle } from 'lucide-react';
import { getErrorMessage } from '@/utils/get-app-error';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  changeProfilePasswordAction,
  sendProfileChangePasswordOtpAction,
} from '@/actions/user/profile.actions';

interface ChangePasswordModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  user,
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [step, setStep] = useState<'otp' | 'form'>('otp');
  const [otpLoading, setOtpLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      otp: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await sendProfileChangePasswordOtpAction();

      if (!response.success) {
        toast.error(response.error || 'Failed to send OTP');
        return;
      }

      toast.success('OTP sent successfully');
      setStep('form');
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const response = await changeProfilePasswordAction(data);

      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to update password');
        return;
      }

      toast.success('Password updated successfully');
      reset();
      setStep('otp');
      onClose();
    } catch (error: unknown) {
      console.log('Password update error:', error);
      const errorMsg = getErrorMessage(error) || 'Failed to update password';
      toast.error(errorMsg);
    }
  };

  const handleClose = () => {
    reset();
    setStep('otp');
    onClose();
  };

  const handleBackToOtp = () => {
    setStep('otp');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background w-full max-w-md rounded-xl border shadow-lg p-6 animate-in zoom-in-95">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            {user.authProvider === AuthProvider.GOOGLE
              ? 'Set Password'
              : 'Change Password'}
          </DialogTitle>
          <DialogDescription>
            {user.authProvider === AuthProvider.GOOGLE
              ? 'Set Password'
              : 'Change Password'}
          </DialogDescription>
        </DialogHeader>

        {step === 'otp' ? (
          <div className="text-center py-4">
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSendOtp} disabled={otpLoading}>
                {otpLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Send Confirmation Code
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  {errors.root.message}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>One-Time Password (OTP)</Label>
              <Input
                {...register('otp')}
                placeholder="123456"
                className="text-center tracking-[0.5em] font-mono text-lg"
                maxLength={6}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs">{errors.otp.message}</p>
              )}
            </div>

            {user.authProvider !== AuthProvider.GOOGLE && (
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" {...register('oldPassword')} />
                {errors.oldPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" {...register('newPassword')} />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBackToOtp}
                className="text-muted-foreground"
              >
                Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
