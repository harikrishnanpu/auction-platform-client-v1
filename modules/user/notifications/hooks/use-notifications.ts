'use client';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { useEffect, useMemo, useState } from 'react';

export interface IUserNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const streamUrl = buildApiUrl(API_ENDPOINTS.user.notificationsStream);
    const source = new EventSource(streamUrl, { withCredentials: true });

    source.onopen = () => {
      setError(null);
    };

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as unknown;

        const items = Array.isArray(parsed) ? parsed : [];
        setNotifications(items as IUserNotification[]);
        setLoading(false);
      } catch {
        setError('Failed to parse notification stream');
        setLoading(false);
      }
    };

    source.onerror = () => {
      setError('Notification stream disconnected');
      setLoading(false);
    };

    return () => {
      source.close();
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
  };
}
