import { getSubscriptionFeatureMetadataAction } from '@/actions/admin/admin.actions';
import { SubscriptionPlansView } from '@/features/admin/subscriptions/components/subscription-plans-view';

export default async function AdminSubscriptionCreatePage() {
  const response = await getSubscriptionFeatureMetadataAction();
  const features = response.success ? (response.data?.features ?? []) : [];
  return <SubscriptionPlansView allowedFeatures={features} />;
}
