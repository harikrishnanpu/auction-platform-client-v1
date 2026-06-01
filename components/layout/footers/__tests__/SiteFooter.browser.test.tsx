import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { SiteFooter } from '../site-footer';

const APP_BRAND = 'Hammer Down';

describe('SiteFooter', () => {
  it('should render the SiteFooter component with default props', async () => {
    const { getByTestId } = await render(<SiteFooter />);
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(`© ${new Date().getFullYear()} ${APP_BRAND} Inc.`);
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent('v1.0.0');
  });

  it('should render the SiteFooter component with custom props', async () => {
    const year = String(new Date().getFullYear());
    const appVersion = '1.0.0';
    const { getByTestId } = await render(
      <SiteFooter year={year} appVersion={appVersion} />
    );
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(`© ${year} ${APP_BRAND} Inc.`);
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent(`v${appVersion}`);
  });
});
