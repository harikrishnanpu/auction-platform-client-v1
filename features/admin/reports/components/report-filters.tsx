'use client';

import { FraudReportStatus } from '@/types/fraud-report.type';

export interface ReportFilterState {
  search: string;
  status: FraudReportStatus | 'ALL';
  limit: number;
}

export const DEFAULT_REPORT_FILTERS: ReportFilterState = {
  search: '',
  status: 'ALL',
  limit: 10,
};

export function ReportFilters({
  filters,
  onChange,
  total,
}: {
  filters: ReportFilterState;
  onChange: (next: ReportFilterState) => void;
  total: number;
}) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          placeholder="Search by reason or user id"
        />
        <select
          value={filters.status}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as ReportFilterState['status'],
            })
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="ALL">All status</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select
          value={String(filters.limit)}
          onChange={(e) =>
            onChange({ ...filters, limit: Number(e.target.value) })
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
        </select>
        <div className="text-sm text-muted-foreground flex items-center">
          Total reports: {total}
        </div>
      </div>
    </div>
  );
}
