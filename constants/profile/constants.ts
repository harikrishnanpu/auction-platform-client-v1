import { COMMON_VALIDATION } from '@/constants/common/validation.constants';

export const PROFILE_VALIDATION = {
  ...COMMON_VALIDATION,
} as const;

export const PROFILE_MESSAGES = {
  UPDATED: 'Profile updated successfully',
  UPDATE_FAILED: 'Failed to update profile',
  UPDATE_ERROR: 'An error occurred while updating profile',
  PASSWORD_UPDATED: 'Password updated successfully',
  PASSWORD_UPDATE_FAILED: 'Failed to update password',
  PHOTO_UPDATED: 'Profile photo updated',
  AVATAR_UPLOAD_URL_FAILED: 'Failed to get upload url',
  AVATAR_UPLOAD_FAILED: 'Failed to upload avatar',
  AVATAR_UPDATE_FAILED: 'Failed to update avatar',
} as const;

export const COMPLETE_PROFILE_VALIDATION = {
  PHONE_FORMAT: 'Phone number must be 10 digits starting with 6-9',
  ADDRESS_MIN: COMMON_VALIDATION.ADDRESS_MIN_10,
  ADDRESS_MAX: COMMON_VALIDATION.ADDRESS_MAX_500,
  ADDRESS_INVALID_CHARS: COMMON_VALIDATION.ADDRESS_INVALID_CHARS,
} as const;

export const COMPLETE_PROFILE_MESSAGES = {
  UPDATED: 'Profile updated successfully',
} as const;
