export const SYSTEM_CONFIG_ALLOWED_KEYS = [
  'fraud.suspension_threshold',
  'fraud.temporary_suspension_duration_ms',
] as const;

export type SystemConfigKey = (typeof SYSTEM_CONFIG_ALLOWED_KEYS)[number];

export const isSystemConfigKey = (value: string): value is SystemConfigKey => {
  return SYSTEM_CONFIG_ALLOWED_KEYS.includes(value as SystemConfigKey);
};
