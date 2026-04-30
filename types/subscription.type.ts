export type SubscriptionFeatureValueType = 'BOOLEAN' | 'NUMBER' | 'STRING';

export interface IAllowedSubscriptionFeatureMetadata {
  id: string;
  key: string;
  valueType: SubscriptionFeatureValueType;
  description: string;
}

export interface ISubscriptionPlanFeature {
  id: string;
  featureKey: string;
  description: string;
  value: string;
  type: SubscriptionFeatureValueType;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isDefault: boolean;
  isActive: boolean;
  razorpayPlanId?: string | null;
  createdAt: string;
  updatedAt: string;
  features: ISubscriptionPlanFeature[];
}

export interface ISubscribedUser {
  userId: string;
  name: string;
  email: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
}
