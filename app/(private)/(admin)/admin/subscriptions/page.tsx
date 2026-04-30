import {
  getSubscriptionFeatureMetadataAction,
  getSubscriptionPlansAction,
} from '@/actions/admin/admin.actions';
import { SubscriptionPlansListView } from '@/features/admin/subscriptions/components/subscription-plans-list-view';

export default async function AdminSubscriptionsPage() {
  const [plansResponse, featuresResponse] = await Promise.all([
    getSubscriptionPlansAction(),
    getSubscriptionFeatureMetadataAction(),
  ]);
  const plans = plansResponse.success ? (plansResponse.data?.plans ?? []) : [];
  const allowedFeatures = featuresResponse.success
    ? (featuresResponse.data?.features ?? [])
    : [];

  return (
    <SubscriptionPlansListView
      initialPlans={plans}
      allowedFeatures={allowedFeatures}
    />
  );
}
