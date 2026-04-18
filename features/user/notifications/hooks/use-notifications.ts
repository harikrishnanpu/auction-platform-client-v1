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
  const [totalCount, setTotalCount] = useState(0);
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
        const parsed = JSON.parse(event.data) as {
          items?: IUserNotification[];
          totalCount?: number;
        };

        const items = Array.isArray(parsed?.items) ? parsed.items : [];
        setNotifications(items);
        setTotalCount(
          Number.isFinite(parsed?.totalCount as number)
            ? (parsed.totalCount as number)
            : 0
        );
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

  const hasNotifications = useMemo(() => totalCount > 0, [totalCount]);

  return {
    notifications,
    totalCount,
    hasNotifications,
    loading,
    error,
  };
}
