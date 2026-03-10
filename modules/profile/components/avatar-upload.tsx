'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserInfo as User } from '@/types/user.type';
import { getErrorMessage } from '@/utils/get-app-error';

interface AvatarUploadProps {
  user: User;
  onUploadSuccess: () => void;
}

export function AvatarUpload({ user }: AvatarUploadProps) {
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
    } catch (error: unknown) {
      console.error('Avatar upload error:', error);
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
          <Image
            src={user.avatar_url}
            alt={user.name}
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={
              !!user.avatar_url?.includes('googleusercontent') ||
              !!user.avatar_url?.includes('amazonaws')
            }
          />
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
