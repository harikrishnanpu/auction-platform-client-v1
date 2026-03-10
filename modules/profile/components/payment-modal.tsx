'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const getApiBase = () => process.env.NEXT_PUBLIC_API_BASE_URL || '';
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

interface PaymentModalProps {
  auction: {
    id: string;
    title: string;
    currentPrice: number;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name: string;
      description: string;
      handler: (response: RazorpayResponse) => void;
      modal?: { ondismiss?: () => void };
    }) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Resolve anyway to avoid hanging
    document.body.appendChild(script);
  });
}

export function PaymentModal({
  auction,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const openRazorpayCheckout = useCallback(async () => {
    if (!RAZORPAY_KEY) {
      setError(
        'Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID.'
      );
      return;
    }

    setPaying(true);
    setError(null);

    try {
      const res = await fetch(
        `${getApiBase()}/auctions/${auction.id}/payment/create-order`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (!data.success || !data.data?.orderId) {
        throw new Error(data.error || 'Failed to create order');
      }

      const { orderId, amount } = data.data;

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout failed to load');
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        order_id: orderId,
        name: 'HammerDown Auction',
        description: auction.title,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch(
              `${getApiBase()}/auctions/${auction.id}/payment/verify`,
              {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success('Payment Successful! 🎉', {
                description: 'Your payment has been processed successfully.',
              });
              onSuccess?.();
              onClose();
              router.refresh();
            } else {
              throw new Error(
                verifyData.error || 'Payment verification failed'
              );
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            toast.error('Payment verification failed', { description: msg });
            setError(msg);
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to initiate payment'
      );
      toast.error('Payment Error', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setPaying(false);
    }
  }, [auction.id, auction.title, onClose, onSuccess, router]);

  useEffect(() => {
    loadRazorpayScript().then(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-background w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transform transition-all relative">
        {/* Close Button line */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 text-white transition-colors z-10"
          disabled={paying}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Header Decoration */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-bold mb-1 tracking-tight">
            Congratulations!
          </h2>
          <p className="text-green-100 font-medium">You won this auction</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/40 rounded-xl border">
              <div className="flex-1 pr-4">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                  Auction Item
                </p>
                <p className="font-semibold text-foreground line-clamp-1">
                  {auction.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl border border-green-200 dark:border-green-900 border-dashed">
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold tracking-wider mb-1">
                  Winning Bid Amount
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-green-700 dark:text-green-400 tracking-tight">
                    ₹{auction.currentPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white dark:bg-green-900/50 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-green-100 dark:border-green-800">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500 shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300">
                  Payment Deadline
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 leading-relaxed">
                  If payment is not completed within 24 hours, the item will be
                  offered to the next highest bidder.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-800 dark:text-red-400 text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={openRazorpayCheckout}
              disabled={loading || paying || !RAZORPAY_KEY}
              className="w-full relative group overflow-hidden bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl py-4 transition-all duration-300 disabled:opacity-70 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out transition-transform" />

              {paying ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Secure Payment...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Proceed to Payment</span>
                </div>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              100% Secure Checkout via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
