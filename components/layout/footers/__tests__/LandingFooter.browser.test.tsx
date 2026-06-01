import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { LandingFooter } from '../landingFooter';
import { it } from 'vitest';

const APP_BRAND = 'Hammer Down';

describe('LandingFooter', () => {
  it('should render the LandingFooter component with default props', async () => {
    const { getByTestId } = await render(<LandingFooter />);
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(
        `© ${new Date().getFullYear()} ${APP_BRAND} Inc. All rights reserved.`
      );
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent('v1.0.0');
  });

  it('should render the LandingFooter component with custom props', async () => {
    const year = String(new Date().getFullYear());
    const appVersion = '1.0.0';
    const { getByTestId } = await render(
      <LandingFooter appVersion={appVersion} year={year} />
    );
    await expect
      .element(getByTestId('copyright'))
      .toHaveTextContent(`© ${year} ${APP_BRAND} Inc. All rights reserved.`);
    await expect
      .element(getByTestId('app-version'))
      .toHaveTextContent(`v${appVersion}`);
  });
});
