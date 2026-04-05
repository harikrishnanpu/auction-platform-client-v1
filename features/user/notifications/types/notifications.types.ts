'use client';

export interface IUserNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
}

export interface IUserNotificationsPage {
  items: IUserNotification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
