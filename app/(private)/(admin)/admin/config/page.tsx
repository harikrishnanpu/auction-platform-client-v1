import { getSystemConfigsAction } from '@/actions/admin/admin.actions';
import { SystemConfigManagementView } from '@/features/admin/config/components/system-config-management-view';

export default async function AdminSystemConfigPage() {
  const response = await getSystemConfigsAction();
  const configs = response.success ? (response.data?.configs ?? []) : [];

  return <SystemConfigManagementView initialConfigs={configs} />;
}
