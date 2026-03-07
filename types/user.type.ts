export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
  MODERATOR = 'MODERATOR',
}

export enum AuthProvider {
  GOOGLE = 'google',
  EMAIL = 'email',
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  authProvider: AuthProvider;
  roles: UserRole[];
  phone?: string;
  address?: string;
  avatar_url?: string;
}
