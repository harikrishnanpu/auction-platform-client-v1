export const OTP_PURPOSE = {
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
} as const;

export const OTP_CHANNEL = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
} as const;

export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];
export type OtpChannel = (typeof OTP_CHANNEL)[keyof typeof OTP_CHANNEL];
