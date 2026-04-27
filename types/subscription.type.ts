export interface ISubscriptionPlanFeature {
  id: string;
  featureKey: string;
  value: string;
  type: 'BOOLEAN' | 'NUMBER' | 'STRING';
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isActive: boolean;
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
