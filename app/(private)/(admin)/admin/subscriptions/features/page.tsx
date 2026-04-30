import { getSubscriptionFeatureMetadataAction } from '@/actions/admin/admin.actions';
import { SubscriptionFeaturesView } from '@/features/admin/subscriptions/components/subscription-features-view';

export default async function AdminSubscriptionFeaturesPage() {
  const response = await getSubscriptionFeatureMetadataAction();
  const features = response.success ? (response.data?.features ?? []) : [];
  return <SubscriptionFeaturesView features={features} />;
}
