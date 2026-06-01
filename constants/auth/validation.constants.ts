import { COMMON_VALIDATION } from '@/constants/common/validation.constants';

export const AUTH_VALIDATION = {
  ...COMMON_VALIDATION,
  FIRST_NAME_MIN: 'First Name must be at least 2 characters',
  FIRST_NAME_MAX: 'First Name is too long',
  FIRST_NAME_LETTERS_ONLY: 'First Name can only contain letters and spaces',
  LAST_NAME_REQUIRED: 'Last Name is required',
  LAST_NAME_MAX: 'Last Name is too long',
  LAST_NAME_LETTERS_ONLY: 'Last Name can only contain letters and spaces',
  PASSWORD_COMPLEXITY:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  TERMS_REQUIRED: 'You must agree to the terms and privacy policy',
} as const;
