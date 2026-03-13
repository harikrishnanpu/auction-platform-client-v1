export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
  MODERATOR = 'MODERATOR',
}

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
  LOCAL = 'LOCAL',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  status: UserStatus;
  authProvider: AuthProvider;
  roles: UserRole[];
  phone?: string;
  address?: string;
  avatar_url?: string;
}
