import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import AuthNavbar from '../AuthNavbar';

describe('AuthNavbar', () => {
  it('should render the brand logo and Back to Home link', async () => {
    const { getByText } = await render(<AuthNavbar />);

    await expect.element(getByText('Back to Home')).toBeInTheDocument();
  });
});
