import { KycStatus } from '../kyc-status';
import { describe, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expect } from 'vitest';

describe('KycStatus', () => {
  it('should renders default state (INITIAL) correctly', async () => {
    const { getByText } = await render(<KycStatus />);
    await expect.element(getByText('KYC Status')).toBeInTheDocument();
    await expect.element(getByText('Application Started')).toBeInTheDocument();
    await expect
      .element(getByText('Complete tasks to submit'))
      .toBeInTheDocument();
  });

  it('should renders VERIFIED state correctly with completedAt, reviewAt, approvedAt', async () => {
    const { getByText } = await render(
      <KycStatus
        status="VERIFIED"
        completedAt="Oct 12, 2023"
        reviewAt="Oct 13, 2023"
        approvedAt="Oct 14, 2023"
      />
    );
    await expect.element(getByText('Verified')).toBeInTheDocument();
    await expect
      .element(getByText('You are approved to sell!'))
      .toBeInTheDocument();
  });

  it('should renders REJECTED state correctly with completedAt, reviewAt, approvedAt', async () => {
    const { getByText } = await render(
      <KycStatus
        status="REJECTED"
        completedAt="Oct 12, 2023"
        reviewAt="Oct 13, 2023"
        approvedAt="Oct 14, 2023"
      />
    );
    await expect.element(getByText('Application Rejected')).toBeInTheDocument();
    await expect
      .element(getByText('Please check your email for details.'))
      .toBeInTheDocument();
  });

  it('should renders PENDING state correctly with completedAt, reviewAt, approvedAt', async () => {
    const { getByText } = await render(
      <KycStatus
        status="PENDING"
        completedAt="Oct 12, 2023"
        reviewAt="Oct 13, 2023"
        approvedAt="Oct 14, 2023"
      />
    );
    await expect.element(getByText('In Review')).toBeInTheDocument();
    await expect
      .element(getByText('Est. completion: 24 Hours'))
      .toBeInTheDocument();
  });

  it('should renders Compliance Checklist section and Need Assistance card', async () => {
    const { getByText, getByRole } = await render(<KycStatus />);
    await expect.element(getByText('Compliance Checklist')).toBeInTheDocument();
    await expect.element(getByText('Email Verification')).toBeInTheDocument();
    await expect.element(getByText('Phone Verification')).toBeInTheDocument();
    await expect
      .element(getByText('Document Verification'))
      .toBeInTheDocument();
    await expect.element(getByText('Background Check')).toBeInTheDocument();
    await expect.element(getByText('Need Assistance?')).toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: /contact support/i }))
      .toBeInTheDocument();
  });
});
