export interface IUserSubscriptionSummary {
  planId: string;
  planName: string;
  status: string;
  endDate: string;
}

export type SubscriptionFeatureValueType = 'BOOLEAN' | 'NUMBER' | 'STRING';

export interface ISubscriptionPlanFeature {
  id: string;
  featureKey: string;
  description: string;
  value: string;
  type: SubscriptionFeatureValueType;
}

export interface IPublicSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isDefault: boolean;
  features: ISubscriptionPlanFeature[];
  isCurrentPlan: boolean;
}

export interface IStartSubscriptionCheckoutResult {
  userSubscriptionId: string;
  razorpaySubscriptionId: string;
  shortUrl: string;
  razorpayKeyId: string;
}
