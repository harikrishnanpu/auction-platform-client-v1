import { ChangePasswordFormValues } from '@/modules/profile/schemes/changeprofilePassword.schema';
import { EditProfileFormValues } from '@/modules/profile/schemes/editProfile.schema';
import { profileService } from '@/services/user/profile.service';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';

export const getProfileAction = async (): Promise<ApiResponse<UserInfo>> => {
  return await profileService.getProfile();
};

export const editProfileAction = async (
  data: EditProfileFormValues
): Promise<ApiResponse<{ user: UserInfo }>> => {
  return await profileService.editProfile(data);
};

export const sendProfileChangePasswordOtpAction = async (): Promise<
  ApiResponse<null>
> => {
  return await profileService.sendProfileChangePasswordOtp();
};

export const changeProfilePasswordAction = async (
  data: ChangePasswordFormValues
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
): Promise<ApiResponse<{ user: UserInfo }>> => {
  return await profileService.updateAvatar(fileKey);
};
