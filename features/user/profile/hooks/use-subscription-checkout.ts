'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SUBSCRIPTION_MESSAGES } from '@/constants/user/messages.constants';
import { toast } from 'sonner';
import { startUserSubscriptionCheckoutAction } from '@/actions/user/subscription.actions';
import { loadRazorpayScript, type RazorpayOptions } from '@/lib/razorpay';
import useUserStore from '@/store/user.store';

export function useSubscriptionCheckout() {
  const router = useRouter();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const user = useUserStore((state) => state.user);

  const startCheckout = (subscriptionPlanId: string) => {
    setActivePlanId(subscriptionPlanId);
    startTransition(async () => {
      const response =
        await startUserSubscriptionCheckoutAction(subscriptionPlanId);

      if (!response.success || !response.data) {
        toast.error(response.error);
        setActivePlanId(null);
        return;
      }

      console.log('RESPONSE FRM BACKEND: ', response.data);
      const isRazorpayLoaded = await loadRazorpayScript();

      if (!isRazorpayLoaded || !window.Razorpay) {
        toast.error(SUBSCRIPTION_MESSAGES.RAZORPAY_LOAD_FAILED);
        setActivePlanId(null);
        return;
      }

      const checkoutOptions: RazorpayOptions = {
        key: response.data.razorpayKeyId,
        subscription_id: response.data.razorpaySubscriptionId,
        name: 'Auction Platform',
        description: 'Subscription Checkout',
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        handler: () => {
          toast.success(SUBSCRIPTION_MESSAGES.CHECKOUT_SUCCESS);
          setActivePlanId(null);
          router.refresh();
        },
        modal: {
          ondismiss: () => {
            toast.info(SUBSCRIPTION_MESSAGES.CHECKOUT_CANCELLED);
            setActivePlanId(null);
            router.refresh();
          },
        },
      };

      const razorpay = new window.Razorpay(checkoutOptions);
      razorpay.open();
    });
  };

  return {
    isPending,
    activePlanId,
    startCheckout,
  };
}
