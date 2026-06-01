import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  define: {
    'process.env': {
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SOCKET_URL: 'http://localhost:3000',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:3000',
      AUTH_ACCESS_TOKEN_MAX_AGE: '3600',
      AUTH_REFRESH_TOKEN_MAX_AGE: '86400',
      COOKIE_SECURE: 'false',
      COOKIE_SAME_SITE: 'lax',
      ENABLE_COOKIE_DOMAIN: 'false',
    },
  },
  test: {
    globals: true,
    include: ['**/*.browser.{test,spec}.{ts,tsx}'],

    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['tests/vitest.setup.tsx'],
  },
});
