import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { AppSidebar } from '../app-sidebar';

const mockUseUserStore = vi.fn();
const mockUsePathname = vi.fn();
const mockRouterReplace = vi.fn();

vi.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: (selector: unknown) => {
    return mockUseUserStore(selector);
  },
}));

vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  logoutAction: vi.fn(),
}));

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/home');
    mockUseUserStore.mockReturnValue(vi.fn());
  });

  it('should render the AppSidebar component on desktop view', async () => {
    const { getByText } = await render(
      <AppSidebar mobileOpen={false} onMobileClose={vi.fn()} />
    );

    const brand = getByText('Hammer Down').first();
    await expect.element(brand).toBeInTheDocument();
  });
});
