'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  markFraudReportUnderReviewAction,
  updateFraudReportAction,
  getFraudReportsAction,
  reviewFraudReportAction,
} from '@/actions/admin/report.actions';
import { IFraudReport, FraudAdminDecision } from '@/types/fraud-report.type';
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
        toast.error(res.error ?? 'Failed to load reports');
        return;
      }
      setReports(res.data?.reports ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReview = async (
    reportId: string,
    decision: FraudAdminDecision
  ) => {
    const res = await reviewFraudReportAction(reportId, { decision });
    if (!res.success) {
      toast.error(res.error ?? 'Failed to review report');
      return;
    }
    toast.success('Report reviewed');
    await fetchReports();
  };

  const handleMarkUnderReview = async (reportId: string) => {
    const res = await markFraudReportUnderReviewAction(reportId);
    if (!res.success) {
      toast.error(res.error ?? 'Failed to update report');
      return;
    }
    toast.success('Marked under review');
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
      toast.error(res.error ?? 'Failed to update report');
      return;
    }
    toast.success('Report updated');
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
