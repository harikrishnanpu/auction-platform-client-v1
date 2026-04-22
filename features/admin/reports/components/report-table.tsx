'use client';

import { useState } from 'react';
import { Column, DataTable } from '@/components/ui/data-table';
import { IFraudReport, FraudAdminDecision } from '@/types/fraud-report.type';

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
      {label}
    </span>
  );
}

export function ReportTable({
  reports,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  onReview,
  onMarkUnderReview,
  onUpdateReport,
}: {
  reports: IFraudReport[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onReview: (reportId: string, decision: FraudAdminDecision) => Promise<void>;
  onMarkUnderReview: (reportId: string) => Promise<void>;
  onUpdateReport: (
    reportId: string,
    input: {
      status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
      decision?: 'NO_ACTION' | 'FAULT_VERIFIED' | null;
      category?: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
      reporterType?: 'USER' | 'SELLER' | 'SYSTEM';
      source?: 'MANUAL' | 'SYSTEM';
      level?: 'LOW' | 'MEDIUM' | 'CRITICAL';
    }
  ) => Promise<void>;
}) {
  const [selected, setSelected] = useState<{
    id: string;
    decision: FraudAdminDecision;
  } | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    id: string;
    status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  } | null>(null);
  const [editing, setEditing] = useState<IFraudReport | null>(null);
  const [editData, setEditData] = useState<{
    category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
    status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
    decision: 'NO_ACTION' | 'FAULT_VERIFIED' | '';
    reporterType: 'USER' | 'SELLER' | 'SYSTEM';
    source: 'MANUAL' | 'SYSTEM';
    level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }>({
    category: 'OTHER',
    status: 'OPEN',
    decision: '',
    reporterType: 'USER',
    source: 'MANUAL',
    level: 'LOW',
  });

  const columns: Column<IFraudReport>[] = [
    { header: 'Category', cell: (r) => <Badge label={r.category} /> },
    { header: 'Level', cell: (r) => <Badge label={r.level} /> },
    { header: 'Status', cell: (r) => <Badge label={r.status} /> },
    {
      header: 'Reported By',
      cell: (r) => (
        <span>
          {r.reportedUserName ?? `User ${r.reportedUserId.slice(-4)}`}
        </span>
      ),
    },
    {
      header: 'Targeted User',
      cell: (r) => (
        <span>
          {r.targetedUserName ?? `User ${r.targetedUserId.slice(-4)}`}
        </span>
      ),
    },
    {
      header: 'Reason',
      cell: (r) => <p className="max-w-[280px] truncate">{r.reason}</p>,
    },
    { header: 'Reporter Type', accessorKey: 'reporterType' },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex justify-end gap-2">
          <select
            className="h-8 rounded border px-2 text-xs"
            value={r.status}
            onChange={(e) => {
              const next = e.target.value as
                | 'OPEN'
                | 'UNDER_REVIEW'
                | 'RESOLVED';
              if (next === 'UNDER_REVIEW') {
                setPendingStatus({ id: r.id, status: next });
                return;
              }
              setPendingStatus({ id: r.id, status: next });
            }}
          >
            <option value="OPEN">OPEN</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
          <select
            className="h-8 rounded border px-2 text-xs"
            value={r.adminDecision ?? ''}
            onChange={(e) => {
              const decision = e.target.value as
                | ''
                | 'NO_ACTION'
                | 'FAULT_VERIFIED';
              if (!decision) return;
              setSelected({ id: r.id, decision });
            }}
          >
            <option value="">Decision</option>
            <option value="NO_ACTION">NO_ACTION</option>
            <option value="FAULT_VERIFIED">FAULT_VERIFIED</option>
          </select>
          <button
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => {
              setEditing(r);
              setEditData({
                category: r.category,
                status: r.status,
                decision: (r.adminDecision ?? '') as
                  | 'NO_ACTION'
                  | 'FAULT_VERIFIED'
                  | '',
                reporterType: r.reporterType,
                source: r.source,
                level: r.level,
              });
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={reports}
        columns={columns}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={onPageChange}
        emptyMessage="No reports found."
      />
      {selected ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-card p-5 border border-border">
            <h3 className="text-lg font-semibold mb-2">Confirm review</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Apply decision <strong>{selected.decision}</strong> for this
              report?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-md border px-3 py-1.5 text-sm"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm"
                onClick={async () => {
                  await onReview(selected.id, selected.decision);
                  setSelected(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {pendingStatus ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-card p-5 border border-border">
            <h3 className="text-lg font-semibold mb-2">
              Confirm status change
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Change report status to <strong>{pendingStatus.status}</strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-md border px-3 py-1.5 text-sm"
                onClick={() => setPendingStatus(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm"
                onClick={async () => {
                  if (pendingStatus.status === 'UNDER_REVIEW') {
                    await onMarkUnderReview(pendingStatus.id);
                  } else {
                    await onUpdateReport(pendingStatus.id, {
                      status: pendingStatus.status,
                    });
                  }
                  setPendingStatus(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {editing ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-xl rounded-xl bg-card p-5 border border-border">
            <h3 className="text-lg font-semibold mb-3">Edit report</h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.category}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    category: e.target.value as typeof prev.category,
                  }))
                }
              >
                <option value="OTHER">OTHER</option>
                <option value="AUCTION_FRAUD_CRITICAL">
                  AUCTION_FRAUD_CRITICAL
                </option>
                <option value="PAYMENT_CRITICAL">PAYMENT_CRITICAL</option>
              </select>
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.status}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    status: e.target.value as typeof prev.status,
                  }))
                }
              >
                <option value="OPEN">OPEN</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.decision}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    decision: e.target.value as typeof prev.decision,
                  }))
                }
              >
                <option value="">NONE</option>
                <option value="NO_ACTION">NO_ACTION</option>
                <option value="FAULT_VERIFIED">FAULT_VERIFIED</option>
              </select>
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.reporterType}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    reporterType: e.target.value as typeof prev.reporterType,
                  }))
                }
              >
                <option value="USER">USER</option>
                <option value="SELLER">SELLER</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.source}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    source: e.target.value as typeof prev.source,
                  }))
                }
              >
                <option value="MANUAL">MANUAL</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
              <select
                className="h-9 rounded border px-2 text-sm"
                value={editData.level}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    level: e.target.value as typeof prev.level,
                  }))
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-md border px-3 py-1.5 text-sm"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm"
                onClick={async () => {
                  await onUpdateReport(editing.id, {
                    category: editData.category,
                    status: editData.status,
                    decision: editData.decision || null,
                    reporterType: editData.reporterType,
                    source: editData.source,
                    level: editData.level,
                  });
                  setEditing(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
