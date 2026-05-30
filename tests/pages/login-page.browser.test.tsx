import { describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/(public)/(auth)/login/page';
import { render } from 'vitest-browser-react';

// Mock router replace and navigation hooks
vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
  usePathname: () => '/login',
}));

// Mock Server Actions
vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  loginAction: vi.fn(),
}));

// Mock Zustand store
vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => ({
    setUser: vi.fn(),
  }),
}));

describe('LoginPage Browser Test', () => {
  it('should render the LoginPage correctly in the browser', async () => {
    const { getByText, getByPlaceholder, getByRole } = await render(
      <LoginPage />
    );

    await expect.element(getByText('Welcome Back')).toBeInTheDocument();
    await expect
      .element(getByPlaceholder('name@example.com'))
      .toBeInTheDocument();
    await expect.element(getByPlaceholder('••••••••')).toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: /Sign In/i }))
      .toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: 'Google' }))
      .toBeInTheDocument();
    await expect
      .element(getByText("Don't have an account?"))
      .toBeInTheDocument();
  });
});
