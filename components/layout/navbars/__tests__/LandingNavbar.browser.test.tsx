import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import LandingNavbar from '../LandingNavbar';

describe('LandingNavbar', () => {
  it('should render the brand logo, navigation items, and call to action buttons', async () => {
    const { getByText } = await render(<LandingNavbar />);

    await expect.element(getByText('Features')).toBeInTheDocument();
    await expect.element(getByText('Solutions')).toBeInTheDocument();
    await expect.element(getByText('Why Us')).toBeInTheDocument();
    await expect.element(getByText('Log In')).toBeInTheDocument();
    await expect.element(getByText('Get Started')).toBeInTheDocument();
  });
});
