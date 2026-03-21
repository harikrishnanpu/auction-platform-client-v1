'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserInfo as User } from '@/types/user.type';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeftCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { getErrorMessage } from '@/utils/get-app-error';
import {
  editProfileAction,
  editProfileSendOtpAction,
} from '@/actions/user/profile.actions';
import { useState } from 'react';
import {
  EditProfileFormValues,
  editProfileSchema,
} from '@/modules/user/profile/schemes/editProfile.schema';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const [currentSection, setCurrentSection] = useState<'otp' | 'profile'>(
    'otp'
  );
  const [otpSend, setOtpSend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      otp: '',
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
    },
  });

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const response = await editProfileAction(data);

      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully');
      setCurrentSection('profile');
      setOtpSend(false);
      console.log('response from edit', response.data);
      onSuccess(response.data.user);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || 'An error occurred while updating profile';
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await editProfileSendOtpAction();

      if (!response.success) {
        toast.error(response.error || 'Failed to send OTP');
        return;
      }

      toast.success('OTP sent successfully');
      setOtpSend(true);
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || 'An error occurred while sending OTP';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setCurrentSection('otp');
    setOtpSend(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background w-full max-w-md rounded-xl border shadow-lg p-6 animate-in zoom-in-95">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {currentSection === 'profile' && (
              <Button
                className="shadow-none border-none"
                size="icon-lg"
                aria-label="back"
                variant="outline"
                onClick={() => setCurrentSection('otp')}
              >
                <ArrowLeftCircle />
              </Button>
            )}
            <DialogTitle>Edit Profile</DialogTitle>
          </div>
          <DialogDescription>
            {currentSection === 'otp'
              ? otpSend
                ? 'Enter the OTP sent to your email'
                : 'Click on send OTP to get the OTP'
              : 'Update your profile information'}
          </DialogDescription>
        </DialogHeader>

        {errors.root && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">
              {errors.root.message}
            </p>
          </div>
        )}

        {currentSection === 'otp' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <Input {...register('otp')} placeholder="Enter OTP" />
                  {errors.otp && (
                    <p className="text-red-500 text-xs">{errors.otp.message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentSection('profile')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant={otpSend ? 'ghost' : 'default'}
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </Button>
                  <Button
                    type="button"
                    variant={otpSend ? 'default' : 'ghost'}
                    onClick={() => setCurrentSection('profile')}
                    disabled={isSubmitting || !otpSend}
                  >
                    {isSubmitting ? 'Sending...' : 'Next'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentSection === 'profile' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input {...register('name')} placeholder={user.name} />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                {...register('phone')}
                placeholder="+1234567890"
                inputMode="tel"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Address *</Label>
              <Textarea
                {...register('address')}
                placeholder="123 Main St, City, Country"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
