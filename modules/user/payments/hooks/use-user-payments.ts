'use client';

import {
  createPaymentOrderAction,
  declinePaymentAction,
  getUserPaymentsAction,
  verifyPaymentAction,
} from '@/actions/user/payments.actions';
import { useCallback, useEffect, useState } from 'react';
import type {
  ICreatePaymentOrderResponse,
  IUserPaymentsPage,
  PaymentStatus,
} from '../types/payments.types';

export function useUserPayments({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status: PaymentStatus | 'ALL';
}) {
  const [data, setData] = useState<IUserPaymentsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserPaymentsAction({
        page,
        limit,
        status: status === 'ALL' ? undefined : status,
      });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to load payments');
      }
      setData(result.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const createPaymentOrder = useCallback(
    async (paymentId: string): Promise<ICreatePaymentOrderResponse> => {
      const result = await createPaymentOrderAction({ paymentId });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to create payment order');
      }
      return result.data;
    },
    []
  );

  const verifyPayment = useCallback(
    async (input: {
      paymentId: string;
      orderId: string;
      gatewayPaymentId: string;
      signature: string;
    }) => {
      const result = await verifyPaymentAction(input);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to verify payment');
      }
      await fetchPayments();
    },
    [fetchPayments]
  );

  const declinePayment = useCallback(
    async (paymentId: string) => {
      const result = await declinePaymentAction({ paymentId });
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to decline payment');
      }
      await fetchPayments();
    },
    [fetchPayments]
  );

  return {
    data,
    loading,
    error,
    refresh: fetchPayments,
    createPaymentOrder,
    verifyPayment,
    declinePayment,
  };
}
