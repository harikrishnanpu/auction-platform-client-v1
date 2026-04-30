export interface IUserSubscriptionSummary {
  planId: string;
  planName: string;
  status: string;
  endDate: string;
}

export interface IPublicSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
}

export interface IStartSubscriptionCheckoutResult {
  userSubscriptionId: string;
  razorpaySubscriptionId: string;
  shortUrl: string;
  razorpayKeyId: string;
}
