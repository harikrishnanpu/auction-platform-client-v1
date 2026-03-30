'use client';

export type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayConstructor = new (options: {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}) => { open: () => void };

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const razorpayWindow = window as Window & {
    Razorpay?: RazorpayConstructor;
  };

  if (razorpayWindow.Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(razorpayWindow.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
