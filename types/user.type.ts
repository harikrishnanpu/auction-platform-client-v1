export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
  MODERATOR = 'MODERATOR',
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  is_profile_completed?: boolean;
  roles: UserRole[];
  phone?: string;
  address?: string;
  avatar_url?: string;
}
