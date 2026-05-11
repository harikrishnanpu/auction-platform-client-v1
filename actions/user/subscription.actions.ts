'use server';

import { profileService } from '@/services/user/profile.service';
import { ApiResponse } from '@/types/api.index';
import type {
  IPublicSubscriptionPlan,
  IStartSubscriptionCheckoutResult,
} from '@/types/user-subscription.type';

export const getUserSubscriptionPlansAction = async (): Promise<
  ApiResponse<IPublicSubscriptionPlan[]>
> => {
  return await profileService.getSubscriptionPlans();
};

export const startUserSubscriptionCheckoutAction = async (
  subscriptionPlanId: string
): Promise<ApiResponse<IStartSubscriptionCheckoutResult>> => {
  return await profileService.startSubscriptionCheckout(subscriptionPlanId);
};
