import { describe, expect, it, vi } from 'vitest';
import RegisterPage from '@/app/(public)/(auth)/register/page';
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
  usePathname: () => '/register',
}));

// Mock Server Actions
vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  registerAction: vi.fn(),
}));

describe('RegisterPage Browser Test', () => {
  it('should render the RegisterPage correctly in the browser', async () => {
    const { getByText, getByPlaceholder, getByRole } = await render(
      <RegisterPage />
    );

    // Resolve duplicate title match by checking the first match
    await expect
      .element(getByText('Create Account').first())
      .toBeInTheDocument();

    await expect.element(getByPlaceholder('First name')).toBeInTheDocument();
    await expect.element(getByPlaceholder('Last name')).toBeInTheDocument();
    await expect
      .element(getByPlaceholder('example@example.com'))
      .toBeInTheDocument();
    await expect
      .element(getByPlaceholder('+1 234 567 890'))
      .toBeInTheDocument();
    await expect.element(getByPlaceholder('Full address')).toBeInTheDocument();
    await expect.element(getByPlaceholder('••••••••')).toBeInTheDocument();
    await expect
      .element(getByRole('checkbox', { name: /I agree to the/i }))
      .toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: 'Create Account' }))
      .toBeInTheDocument();
  });
});
