import {
  getSystemConfigKeysAction,
  getSystemConfigsAction,
} from '@/actions/admin/admin.actions';
import { SystemConfigManagementView } from '@/features/admin/config/components/system-config-management-view';

export default async function AdminSystemConfigPage() {
  const [response, keysResponse] = await Promise.all([
    getSystemConfigsAction(),
    getSystemConfigKeysAction(),
  ]);
  const configs = response.success ? (response.data?.configs ?? []) : [];
  const allowedKeys = keysResponse.success
    ? (keysResponse.data?.keys ?? [])
    : [];

  return (
    <SystemConfigManagementView
      initialConfigs={configs}
      allowedKeys={allowedKeys}
    />
  );
}
