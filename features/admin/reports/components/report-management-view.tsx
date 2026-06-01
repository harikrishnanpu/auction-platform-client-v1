'use client';

import { useCallback, useState } from 'react';
import {
  markFraudReportUnderReviewAction,
  updateFraudReportAction,
  getFraudReportsAction,
  reviewFraudReportAction,
} from '@/actions/admin/report.actions';
import { IFraudReport, FraudAdminDecision } from '@/types/fraud-report.type';
import { ADMIN_REPORT_MESSAGES } from '@/constants/admin/messages.constants';
import { useAsyncEffect } from '@/hooks/use-async-effect';
import { toast } from 'sonner';
import {
  DEFAULT_REPORT_FILTERS,
  ReportFilters,
  ReportFilterState,
} from './report-filters';
import { ReportTable } from './report-table';

export function ReportManagementView() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ReportFilterState>(
    DEFAULT_REPORT_FILTERS
  );
  const [reports, setReports] = useState<IFraudReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFraudReportsAction({
        page,
        limit: filters.limit,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
        sort: 'createdAt',
        order: 'desc',
      });
      if (!res.success) {
        toast.error(res.error ?? ADMIN_REPORT_MESSAGES.LOAD_FAILED);
        return;
      }
      setReports(res.data?.reports ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useAsyncEffect(() => {
    void fetchReports();
  }, [fetchReports]);

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
    await fetchReports();
  };

  const handleMarkUnderReview = async (reportId: string) => {
    const res = await markFraudReportUnderReviewAction(reportId);
    if (!res.success) {
      toast.error(res.error ?? ADMIN_REPORT_MESSAGES.UPDATE_FAILED);
      return;
    }
    toast.success(ADMIN_REPORT_MESSAGES.UNDER_REVIEW);
    await fetchReports();
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
    await fetchReports();
  };

  return (
    <div className="container mx-auto px-2 py-6">
      <h1 className="text-3xl font-bold mb-2">Fraud Reports</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Review reports, verify victims, and mark fraud faults.
      </p>
      <ReportFilters
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        total={total}
      />
      <ReportTable
        reports={reports}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onReview={handleReview}
        onMarkUnderReview={handleMarkUnderReview}
        onUpdateReport={handleUpdateReport}
      />
    </div>
  );
}
