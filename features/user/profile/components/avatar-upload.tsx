'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { MEDIA_MESSAGES } from '@/constants/common/messages.constants';
import { PROFILE_MESSAGES } from '@/constants/profile/constants';
import { toast } from 'sonner';

import {
  getAvatarUploadUrlAction,
  updateAvatarAction,
  uploadAvatarAction,
} from '@/actions/user/profile.actions';
import { cn } from '@/lib/utils';
import { AuthProvider, type IUser as User } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { getUserAvatarUrl } from '@/utils/auction-utils';

interface AvatarUploadProps {
  user: User;
  onUploadSuccess: (user: User) => void;
  size?: 'md' | 'lg';
}

const SIZE_CLASSES = {
  md: {
    box: 'h-24 w-24',
    img: 96,
    icon: 'h-6 w-6',
    initials: 'text-lg',
  },
  lg: {
    box: 'h-28 w-28 sm:h-32 sm:w-32',
    img: 128,
    icon: 'h-7 w-7',
    initials: 'text-xl',
  },
} as const;

export function AvatarUpload({
  user,
  onUploadSuccess,
  size = 'lg',
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dims = SIZE_CLASSES[size];

  const avatarSrc =
    user.avatar_url && user.authProvider === AuthProvider.LOCAL
      ? getUserAvatarUrl(user.avatar_url)
      : user.avatar_url;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error(MEDIA_MESSAGES.IMAGE_SIZE_MAX);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(MEDIA_MESSAGES.IMAGE_ONLY);
        return;
      }

      setUploading(true);

      const response = await getAvatarUploadUrlAction({
        contentType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });

      if (!response.success || !response.data) {
        toast.error(
          response.error || PROFILE_MESSAGES.AVATAR_UPLOAD_URL_FAILED
        );
        return;
      }

      const { uploadUrl, fileKey } = response.data;

      const uploadResponse = await uploadAvatarAction(uploadUrl, file);

      if (!uploadResponse.success) {
        toast.error(
          uploadResponse.error || PROFILE_MESSAGES.AVATAR_UPLOAD_FAILED
        );
        return;
      }

      const updateResponse = await updateAvatarAction(fileKey);

      if (!updateResponse.success || !updateResponse.data) {
        toast.error(
          updateResponse.error || PROFILE_MESSAGES.AVATAR_UPDATE_FAILED
        );
        return;
      }

      onUploadSuccess(updateResponse.data.user);
      toast.success(PROFILE_MESSAGES.PHOTO_UPDATED);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) || PROFILE_MESSAGES.AVATAR_UPLOAD_FAILED
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="group relative inline-block shrink-0 cursor-pointer"
      onClick={() => !uploading && fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!uploading) fileInputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload profile photo"
    >
      <div
        className={cn(
          'overflow-hidden rounded-full border-4 border-background shadow-md ring-2 ring-brand-100 transition-all group-hover:ring-brand-300 dark:ring-brand-900/50',
          dims.box
        )}
      >
        {uploading ? (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Loader2 className="size-7 animate-spin text-brand-600" />
          </div>
        ) : avatarSrc ? (
          <Image
            className="h-full w-full object-cover"
            src={avatarSrc}
            alt=""
            width={dims.img}
            height={dims.img}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-50 font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
            <span className={dims.initials}>
              {user.name?.slice(0, 2)?.toUpperCase() ?? 'HD'}
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
        <Camera className={cn('text-white drop-shadow-md', dims.icon)} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}
