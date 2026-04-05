'use server';
import { ZodChangePasswordFormValues } from '@/features/user/profile/schemes/changeprofilePassword.schema';
import { ZodEditProfileFormValues } from '@/features/user/profile/schemes/editProfile.schema';
import { profileService } from '@/services/user/profile.service';
import { ApiResponse } from '@/types/api.index';
import { IUser } from '@/types/user.type';

export const getProfileAction = async (): Promise<ApiResponse<IUser>> => {
  return await profileService.getProfile();
};

export const editProfileAction = async (
  data: ZodEditProfileFormValues
): Promise<ApiResponse<{ user: IUser }>> => {
  return await profileService.editProfile(data);
};

export const sendProfileChangePasswordOtpAction = async (): Promise<
  ApiResponse<null>
> => {
  return await profileService.sendProfileChangePasswordOtp();
};

export const changeProfilePasswordAction = async (
  data: ZodChangePasswordFormValues
): Promise<ApiResponse<null>> => {
  return await profileService.changeProfilePassword(data);
};

export const editProfileSendOtpAction = async (): Promise<
  ApiResponse<null>
> => {
  return await profileService.editProfileSendOtp();
};

export const getAvatarUploadUrlAction = async ({
  contentType,
  fileName,
  fileSize,
}: {
  contentType: string;
  fileName: string;
  fileSize: number;
}): Promise<ApiResponse<{ uploadUrl: string; fileKey: string }>> => {
  return await profileService.getAvatarUploadUrl({
    contentType: contentType,
    fileName: fileName,
    fileSize: fileSize,
  });
};

export const uploadAvatarAction = async (
  uploadUrl: string,
  file: File
): Promise<ApiResponse<null>> => {
  return await profileService.uploadAvatar(uploadUrl, file);
};

export const updateAvatarAction = async (
  fileKey: string
): Promise<ApiResponse<{ user: IUser }>> => {
  return await profileService.updateAvatar(fileKey);
};
