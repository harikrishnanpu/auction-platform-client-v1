import { getSubscriptionFeatureMetadataAction } from '@/actions/admin/admin.actions';
import { SubscriptionFeaturesView } from '@/features/admin/subscriptions/components/subscription-features-view';

export default async function AdminSubscriptionFeaturesPage() {
  const response = await getSubscriptionFeatureMetadataAction();
  const featureKeys = response.success
    ? (response.data?.featureKeys ?? [])
    : [];
  return <SubscriptionFeaturesView featureKeys={featureKeys} />;
}
