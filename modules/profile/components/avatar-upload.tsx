'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthProvider, UserInfo as User } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';
import {
  getAvatarUploadUrlAction,
  updateAvatarAction,
  uploadAvatarAction,
} from '@/actions/user/profile.actions';

interface AvatarUploadProps {
  user: User;
  onUploadSuccess: (user: User) => void;
}

export function AvatarUpload({ user, onUploadSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setUploading(true);
    try {
      const response = await getAvatarUploadUrlAction({
        contentType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });

      if (!response.success || !response.data) {
        toast.error(response.error || 'Failed to get upload url');
        return;
      }

      const { uploadUrl, fileKey } = response.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileKey', fileKey);

      const uploadResponse = await uploadAvatarAction(uploadUrl, file);

      if (!uploadResponse.success) {
        toast.error(uploadResponse.error || 'Failed to upload avatar');
        return;
      }

      const updateResponse = await updateAvatarAction(fileKey);

      if (!updateResponse.success || !updateResponse.data) {
        toast.error(updateResponse.error || 'Failed to update avatar');
        return;
      }

      onUploadSuccess(updateResponse.data.user);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || 'Failed to upload avatar';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="relative group cursor-pointer inline-block"
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-xl ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
        {uploading ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : user.avatar_url ? (
          user?.authProvider == AuthProvider.LOCAL ? (
            <Image
              className="rounded-full"
              src={`https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com/${user?.avatar_url}`}
              alt="avatar_url"
              width={128}
              height={128}
            />
          ) : (
            <Image
              className="rounded-full"
              src={user?.avatar_url}
              alt="avatar_url"
              width={128}
              height={128}
            />
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-muted-foreground font-medium">
            <span className="text-2xl font-bold text-gray-600">
              {user.name?.slice(0, 2)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <Camera className="text-white h-8 w-8 drop-shadow-md" />
        <span className="sr-only">Upload Avatar</span>
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
