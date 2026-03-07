import { profileService } from '@/services/user/profile.service';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';

export const getProfileAction = async (): Promise<ApiResponse<UserInfo>> => {
  return await profileService.getProfile();
};

export const getAvatarUploadUrlAction = async (): Promise<
  ApiResponse<string>
> => {
  return await profileService.getAvatarUploadUrl();
};
