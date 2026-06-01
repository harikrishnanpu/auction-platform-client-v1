export const WALLET_MESSAGES = {
  CHECKOUT_OPENING: 'Opening Razorpay checkout',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  WITHDRAWN: 'Amount withdrawn from wallet',
} as const;

export const SUBSCRIPTION_MESSAGES = {
  RAZORPAY_LOAD_FAILED: 'Unable to load Razorpay checkout',
  CHECKOUT_SUCCESS: 'Subscription checkout successful',
  CHECKOUT_CANCELLED: 'Subscription checkout cancelled',
} as const;

export const PAYMENT_MESSAGES = {
  SUCCESS_TITLE: 'Payment Successful!',
  SUCCESS_DESCRIPTION: 'Your payment has been processed successfully.',
  VERIFY_FAILED: 'Payment verification failed',
  ERROR_TITLE: 'Payment Error',
  RAZORPAY_NOT_CONFIGURED: 'Razorpay is not configured.',
  ORDER_CREATE_FAILED: 'Failed to create order',
  CHECKOUT_LOAD_FAILED: 'Razorpay checkout failed to load',
  INITIATE_FAILED: 'Failed to initiate payment',
  UNKNOWN_ERROR: 'Unknown error',
} as const;
