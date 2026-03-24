'use client';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface IUserNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.user.notifications),
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }

      const payload = (await response.json()) as ApiEnvelope<
        IUserNotification[]
      >;
      const items = Array.isArray(payload.data) ? payload.data : [];
      setNotifications(items);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load notifications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();

    const streamUrl = buildApiUrl(API_ENDPOINTS.user.notificationsStream);
    const source = new EventSource(streamUrl, { withCredentials: true });

    source.onmessage = (event) => {
      try {
        const items = JSON.parse(event.data) as IUserNotification[];
        setNotifications(Array.isArray(items) ? items : []);
        setError(null);
        setLoading(false);
      } catch {
        setError('Failed to parse notification stream');
        setLoading(false);
      }
    };

    source.onerror = () => {
      setError('Notification stream disconnected. Using fallback refresh...');
      setLoading(false);
    };

    return () => {
      source.close();
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
  };
}
