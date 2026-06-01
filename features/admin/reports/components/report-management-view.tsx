'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  markFraudReportUnderReviewAction,
  updateFraudReportAction,
  reviewFraudReportAction,
} from '@/actions/admin/report.actions';
import { IFraudReport, FraudAdminDecision } from '@/types/fraud-report.type';
import { ADMIN_REPORT_MESSAGES } from '@/constants/admin/messages.constants';
import { buildReportSearchParams } from '@/lib/admin-search-params';
import { toast } from 'sonner';
import { ReportFilters, ReportFilterState } from './report-filters';
import { ReportTable } from './report-table';

type ReportManagementViewProps = {
  filters: ReportFilterState;
  page: number;
  reports: IFraudReport[];
  total: number;
  totalPages: number;
  error: string | null;
};

export function ReportManagementView({
  filters,
  page,
  reports,
  total,
  totalPages,
  error,
}: ReportManagementViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(nextFilters: ReportFilterState, nextPage: number) {
    const query = buildReportSearchParams(nextFilters, nextPage);
    startTransition(() => {
      router.push(query ? `/admin/reports?${query}` : '/admin/reports');
    });
  }

  const refresh = () => router.refresh();

  const handleReview = async (
    reportId: string,
    decision: FraudAdminDecision
  ) => {
    const res = await reviewFraudReportAction(reportId, { decision });
    if (!res.success) {
      toast.error(res.error ?? ADMIN_REPORT_MESSAGES.REVIEW_FAILED);
      return;
    }
    toast.success(ADMIN_REPORT_MESSAGES.REVIEWED);
    refresh();
  };

  const handleMarkUnderReview = async (reportId: string) => {
    const res = await markFraudReportUnderReviewAction(reportId);
    if (!res.success) {
      toast.error(res.error ?? ADMIN_REPORT_MESSAGES.UPDATE_FAILED);
      return;
    }
    toast.success(ADMIN_REPORT_MESSAGES.UNDER_REVIEW);
    refresh();
  };

  const handleUpdateReport = async (
    reportId: string,
    input: {
      status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
      decision?: 'NO_ACTION' | 'FAULT_VERIFIED' | null;
      category?: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
      reporterType?: 'USER' | 'SELLER' | 'SYSTEM';
      source?: 'MANUAL' | 'SYSTEM';
      level?: 'LOW' | 'MEDIUM' | 'CRITICAL';
    }
  ) => {
    const res = await updateFraudReportAction(reportId, input);
    if (!res.success) {
      toast.error(res.error ?? ADMIN_REPORT_MESSAGES.UPDATE_FAILED);
      return;
    }
    toast.success(ADMIN_REPORT_MESSAGES.UPDATED);
    refresh();
  };

  return (
    <div className="container mx-auto px-2 py-6">
      <h1 className="text-3xl font-bold mb-2">Fraud Reports</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Review reports, verify victims, and mark fraud faults.
      </p>
      <ReportFilters
        filters={filters}
        onChange={(next) => navigate(next, 1)}
        total={total}
      />
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <ReportTable
        reports={reports}
        loading={isPending}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(nextPage) => navigate(filters, nextPage)}
        onReview={handleReview}
        onMarkUnderReview={handleMarkUnderReview}
        onUpdateReport={handleUpdateReport}
      />
    </div>
  );
}
