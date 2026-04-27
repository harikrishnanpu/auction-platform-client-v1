'use client';

import {
  createSystemConfigAction,
  editSystemConfigAction,
} from '@/actions/admin/admin.actions';
import { SystemConfigField } from '@/features/admin/config/components/system-config-field';
import { ISystemConfig } from '@/types/system-config.type';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

export function SystemConfigManagementView({
  initialConfigs,
  allowedKeys,
}: {
  initialConfigs: ISystemConfig[];
  allowedKeys: string[];
}) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [selectedKey, setSelectedKey] = useState(
    initialConfigs[0]?.key ?? allowedKeys[0] ?? ''
  );
  const [description, setDescription] = useState(
    initialConfigs[0]?.description ?? ''
  );
  const [configValue, setConfigValue] = useState(
    initialConfigs[0]?.value ?? ''
  );
  const [isPending, startTransition] = useTransition();

  const selectedConfig = useMemo(
    () => configs.find((config) => config.key === selectedKey),
    [configs, selectedKey]
  );

  const handleSelect = (key: string) => {
    const config = configs.find((item) => item.key === key);
    setSelectedKey(key);
    setDescription(config?.description ?? '');
    setConfigValue(config?.value ?? '');
  };

  const handleSubmit = () => {
    const trimmedKey = selectedKey.trim();
    const trimmedValue = configValue.trim();

    if (!trimmedKey) {
      toast.error('Key is required');
      return;
    }
    if (!allowedKeys.includes(trimmedKey)) {
      toast.error('Invalid system config key');
      return;
    }

    if (!trimmedValue) {
      toast.error('Value is required');
      return;
    }

    startTransition(async () => {
      const payload = {
        key: trimmedKey,
        value: trimmedValue,
        description: description.trim() || null,
      };
      const isExisting = configs.some((item) => item.key === trimmedKey);
      const response = isExisting
        ? await editSystemConfigAction(payload)
        : await createSystemConfigAction(payload);

      if (!response.success || !response.data) {
        toast.error(response.error ?? 'Failed to save config');
        return;
      }

      const next = response.data;
      setConfigs((prev) => {
        const has = prev.some((item) => item.key === next.key);
        if (!has)
          return [...prev, next].sort((a, b) => a.key.localeCompare(b.key));
        return prev.map((item) => (item.key === next.key ? next : item));
      });
      setSelectedKey(next.key);
      setDescription(next.description ?? '');
      setConfigValue(next.value ?? '');
      toast.success(
        isExisting ? 'System config updated' : 'System config created'
      );
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">
        System Configurations
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage runtime constants from the admin panel.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Existing Keys
          </h2>
          <div className="space-y-2">
            {configs.map((config) => (
              <button
                key={config.id}
                type="button"
                onClick={() => handleSelect(config.key)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                  selectedKey === config.key
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {config.key}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="space-y-4">
            <SystemConfigField
              label="Key"
              value={selectedKey}
              onChange={setSelectedKey}
              placeholder={allowedKeys[0] ?? 'key'}
            />

            <SystemConfigField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Short description for admins"
            />

            <SystemConfigField
              label="Value"
              value={configValue}
              onChange={setConfigValue}
              placeholder="3"
              multiline
              rows={6}
            />

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {selectedConfig
                  ? `Last updated: ${new Date(selectedConfig.updatedAt).toLocaleString()}`
                  : 'Create a new key by entering a unique name'}
              </p>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isPending ? 'Saving...' : 'Save Config'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
