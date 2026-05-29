import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { AdminFooter } from '../AdminFooter';

const APP_BRAND = 'Hammer Down';

describe('AdminFooter', () => {
  it('should render the AdminFooter component with default props', async () => {
    const { getByTestId } = await render(<AdminFooter />);
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(
        `© ${new Date().getFullYear()} ${APP_BRAND} Inc. Internal use only.`
      );
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent('v1.0.0');
  });

  it('should render the AdminFooter component with custom props', async () => {
    const year = String(new Date().getFullYear());
    const appVersion = '1.0.0';
    const { getByTestId } = await render(
      <AdminFooter appVersion={appVersion} year={year} />
    );
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(`© ${year} ${APP_BRAND} Inc. Internal use only.`);
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent(`v${appVersion}`);
  });
});
