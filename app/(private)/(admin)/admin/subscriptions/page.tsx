import {
  getSubscriptionFeatureMetadataAction,
  getSubscriptionPlansAction,
} from '@/actions/admin/admin.actions';
import { SubscriptionPlansView } from '@/features/admin/subscriptions/components/subscription-plans-view';

export default async function AdminSubscriptionsPage() {
  const [response, metadataResponse] = await Promise.all([
    getSubscriptionPlansAction(),
    getSubscriptionFeatureMetadataAction(),
  ]);
  const plans = response.success ? (response.data?.plans ?? []) : [];
  const featureKeys = metadataResponse.success
    ? (metadataResponse.data?.featureKeys ?? [])
    : [];
  const valueTypes = metadataResponse.success
    ? (metadataResponse.data?.valueTypes ?? [])
    : [];

  return (
    <SubscriptionPlansView
      initialPlans={plans}
      allowedFeatureKeys={featureKeys}
      allowedValueTypes={valueTypes}
    />
  );
}
