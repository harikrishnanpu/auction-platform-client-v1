export const COMMON_MESSAGES = {
  OTP_SENT: 'OTP sent successfully',
  OTP_SEND_FAILED: 'Failed to send OTP',
  OTP_SEND_ERROR: 'An error occurred while sending OTP',
  OTP_SEND_RETRY: 'Failed to send OTP. Please try again.',
  GENERIC_ERROR: 'An error occurred',
} as const;

export const MEDIA_MESSAGES = {
  AUCTION_ASSET_TYPES: 'Only JPEG, PNG, WebP images and MP4 video are allowed.',
  IMAGE_SIZE_MAX: 'Image size must be less than 5MB',
  IMAGE_ONLY: 'Only image files are allowed',
  UPLOAD_URL_FAILED: 'Failed to get upload URL',
  UPLOAD_STORAGE_FAILED: 'Upload to storage failed',
  UPLOAD_FAILED: 'Upload failed',
} as const;
