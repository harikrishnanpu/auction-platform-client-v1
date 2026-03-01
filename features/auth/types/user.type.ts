export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  is_verified: boolean;
  is_profile_complete: boolean;
  is_blocked: boolean;
}
