'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  ArrowLeft,
  Ban,
  ShieldAlert,
  X,
  Globe,
  KeyRound,
  Clock,
  FileText,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import {
  blockUserAction,
  getAdminSellerAction,
  approveSellerKycAction,
  rejectSellerKycAction,
} from '@/actions/admin/admin.actions';
import { SellerInfo } from '@/services/admin/admin.service';
import { toast } from 'sonner';
import { AuthProvider, UserRole, UserStatus } from '@/types/user.type';
import { KycStatusEnum } from '@/types/kyc.type';
import { KycDocumentViewerModal } from './kyc-document-viewer-modal';

const S3_BASE =
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

const KYC_COLORS: Record<KycStatusEnum, string> = {
  [KycStatusEnum.APPROVED]:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  [KycStatusEnum.SUBMITTED]:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  [KycStatusEnum.PENDING]:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  [KycStatusEnum.REJECTED]:
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  [KycStatusEnum.NOT_SUBMITTED]:
    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function SellerAvatar({ seller }: { seller: SellerInfo }) {
  const src = seller.avatar_url
    ? seller.authProvider === AuthProvider.LOCAL
      ? `${S3_BASE}/${seller.avatar_url}`
      : seller.avatar_url
    : null;

  if (src) {
    return (
      <Image
        src={src}
        alt={seller.name}
        width={56}
        height={56}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
      {seller.name?.slice(0, 2).toUpperCase() ?? '?'}
    </span>
  );
}

function AuthBadge({ provider }: { provider: AuthProvider }) {
  const map = {
    [AuthProvider.GOOGLE]: {
      icon: <Globe size={12} />,
      label: 'Google',
      cls: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    },
    [AuthProvider.EMAIL]: {
      icon: <Mail size={12} />,
      label: 'Email',
      cls: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
    },
    [AuthProvider.LOCAL]: {
      icon: <KeyRound size={12} />,
      label: 'Password',
      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
  };
  const { icon, label, cls } = map[provider] ?? map[AuthProvider.LOCAL];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === UserStatus.BLOCKED)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <Ban size={11} />
        Blocked
      </span>
    );
  if (status === UserStatus.PENDING)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
        <Clock size={11} />
        Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <CheckCircle size={11} />
      Active
    </span>
  );
}

export function SellerDetailView() {
  const params = useParams();
  const router = useRouter();
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmBlock, setConfirmBlock] = useState<{
    id: string;
    name: string;
    block: boolean;
  } | null>(null);
  const [blocking, setBlocking] = useState(false);
  const [kycAction, setKycAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [kycLoading, setKycLoading] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetchSeller(params.id as string);
  }, [params.id]);

  const fetchSeller = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminSellerAction(id);
      if (!res.success) throw new Error(res.error);
      setSeller(res.data);
    } catch {
      setError('Failed to load seller details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockConfirm = async () => {
    if (!confirmBlock) return;
    setBlocking(true);
    try {
      const res = await blockUserAction(confirmBlock.id, confirmBlock.block);
      if (res.success) {
        setSeller((prev) =>
          prev
            ? {
                ...prev,
                status: confirmBlock.block
                  ? UserStatus.BLOCKED
                  : UserStatus.ACTIVE,
              }
            : prev
        );
        toast.success(
          confirmBlock.block ? 'Seller blocked.' : 'Seller unblocked.'
        );
      } else {
        toast.error(res.error ?? 'Failed to update seller status.');
      }
    } catch {
      toast.error('Failed to update seller status.');
    } finally {
      setBlocking(false);
      setConfirmBlock(null);
    }
  };

  const handleKycApprove = async () => {
    if (!seller) return;
    setKycLoading(true);
    try {
      const res = await approveSellerKycAction(seller.id);
      if (res.success) {
        setSeller((prev) =>
          prev
            ? {
                ...prev,
                kycStatus: KycStatusEnum.APPROVED,
                kyc: prev.kyc
                  ? { ...prev.kyc, status: KycStatusEnum.APPROVED }
                  : undefined,
              }
            : prev
        );
        toast.success('KYC approved.');
      } else {
        toast.error(res.error ?? 'Failed to approve KYC.');
      }
    } catch {
      toast.error('Failed to approve KYC.');
    } finally {
      setKycLoading(false);
      setKycAction(null);
    }
  };

  const handleKycReject = async () => {
    if (!seller || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    setKycLoading(true);
    try {
      const res = await rejectSellerKycAction(seller.id, rejectReason.trim());
      if (res.success) {
        setSeller((prev) =>
          prev
            ? {
                ...prev,
                kycStatus: KycStatusEnum.REJECTED,
                kyc: prev.kyc
                  ? {
                      ...prev.kyc,
                      status: KycStatusEnum.REJECTED,
                      rejection_reason_message: rejectReason.trim(),
                    }
                  : undefined,
              }
            : prev
        );
        toast.success('KYC rejected.');
      } else {
        toast.error(res.error ?? 'Failed to reject KYC.');
      }
    } catch {
      toast.error('Failed to reject KYC.');
    } finally {
      setKycLoading(false);
      setKycAction(null);
      setRejectReason('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
          <ShieldAlert size={24} />
        </div>
        <p className="text-sm font-medium text-foreground">{error}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => params.id && fetchSeller(params.id as string)}
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Retry
          </button>
          <button
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  if (!seller) return null;

  const isBlocked = seller.status === UserStatus.BLOCKED;
  const kyc = seller.kyc;
  const kycStatus = (seller.kycStatus ??
    kyc?.status ??
    KycStatusEnum.NOT_SUBMITTED) as KycStatusEnum;
  const canActOnKyc =
    kycStatus === KycStatusEnum.SUBMITTED ||
    kycStatus === KycStatusEnum.PENDING;
  const activeDoc = kyc?.documents?.find((d) => d.id === activeDocId) ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-3">
          <button
            onClick={() => router.back()}
            className="hover:text-foreground transition flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Sellers
          </button>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{seller.name}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-background shadow-sm flex items-center justify-center shrink-0">
              <SellerAvatar seller={seller} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {seller.name}
                </h1>
                {seller.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase border border-green-200 dark:border-green-800">
                    Verified
                  </span>
                )}
                {seller.roles?.includes(UserRole.SELLER) && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold uppercase border border-amber-200 dark:border-amber-800">
                    Seller
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ID: {seller.id}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setConfirmBlock({
                id: seller.id,
                name: seller.name,
                block: !isBlocked,
              })
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
              isBlocked
                ? 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10'
                : 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
            }`}
          >
            <Ban size={16} />
            {isBlocked ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Account Info
          </h2>

          <div className="flex items-start gap-3">
            <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground break-all">
                {seller.email}
              </p>
            </div>
          </div>

          {seller.phone && (
            <div className="flex items-start gap-3">
              <Phone
                size={16}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  {seller.phone}
                </p>
              </div>
            </div>
          )}

          {seller.address && (
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">
                  {seller.address}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Status & Roles
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Account Status
            </span>
            <StatusBadge status={seller.status} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Email Verified
            </span>
            {seller.isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <CheckCircle size={12} /> Yes
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Auth Provider</span>
            <AuthBadge provider={seller.authProvider} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Profile Complete
            </span>
            <span className="text-xs font-medium text-foreground">
              {seller.isProfileCompleted ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {seller.roles?.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  KYC Verification
                </h2>
                <p className="text-xs text-muted-foreground">
                  Seller identity documents
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${KYC_COLORS[kycStatus]}`}
            >
              {kycStatus.replace('_', ' ')}
            </span>
          </div>

          {!kyc && (
            <p className="text-sm text-muted-foreground">
              No KYC submission yet.
            </p>
          )}

          {kyc && (
            <div className="space-y-4">
              {kyc.rejection_reason_message && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Rejection reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                    {kyc.rejection_reason_message}
                  </p>
                </div>
              )}

              {kyc.documents?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Documents
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {kyc.documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setActiveDocId(doc.id);
                          setDocOpen(true);
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:bg-accent transition group"
                      >
                        <FileText
                          size={24}
                          className="text-muted-foreground group-hover:text-foreground"
                        />
                        <span className="text-xs font-medium text-center text-foreground leading-tight">
                          {doc.documentType.replace(/_/g, ' ')}
                          {doc.side ? ` (${doc.side})` : ''}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${KYC_COLORS[doc.documentStatus as unknown as KycStatusEnum] ?? ''}`}
                        >
                          {doc.documentStatus}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {canActOnKyc && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setKycAction('approve')}
                    disabled={kycLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition disabled:opacity-60"
                  >
                    <CheckCheck size={16} /> Approve KYC
                  </button>
                  <button
                    onClick={() => setKycAction('reject')}
                    disabled={kycLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-medium transition disabled:opacity-60"
                  >
                    <XCircle size={16} /> Reject KYC
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {confirmBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmBlock.block ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}
              >
                <ShieldAlert size={24} />
              </div>
              <button
                onClick={() => setConfirmBlock(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {confirmBlock.block ? 'Block Seller?' : 'Unblock Seller?'}
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Are you sure you want to{' '}
              {confirmBlock.block ? 'block' : 'unblock'}{' '}
              <span className="font-bold text-foreground">
                {confirmBlock.name}
              </span>
              ?
              {confirmBlock.block &&
                ' They will lose access to seller features.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBlock(null)}
                disabled={blocking}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockConfirm}
                disabled={blocking}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-70 ${confirmBlock.block ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {blocking
                  ? 'Please wait…'
                  : confirmBlock.block
                    ? 'Confirm Block'
                    : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {kycAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${kycAction === 'approve' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
              >
                {kycAction === 'approve' ? (
                  <CheckCheck size={22} />
                ) : (
                  <XCircle size={22} />
                )}
              </div>
              <button
                onClick={() => {
                  setKycAction(null);
                  setRejectReason('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {kycAction === 'approve' ? 'Approve KYC?' : 'Reject KYC?'}
            </h3>
            {kycAction === 'reject' && (
              <div className="mb-5">
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Reason for rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why the KYC is being rejected…"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            {kycAction === 'approve' && (
              <p className="text-muted-foreground mb-6 text-sm">
                This will approve the KYC for{' '}
                <span className="font-bold text-foreground">{seller.name}</span>{' '}
                and grant them seller access.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setKycAction(null);
                  setRejectReason('');
                }}
                disabled={kycLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  kycAction === 'approve' ? handleKycApprove : handleKycReject
                }
                disabled={kycLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-70 ${kycAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {kycLoading
                  ? 'Please wait…'
                  : kycAction === 'approve'
                    ? 'Confirm Approve'
                    : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <KycDocumentViewerModal
        isOpen={docOpen}
        doc={activeDoc}
        onClose={() => {
          setDocOpen(false);
          setActiveDocId(null);
        }}
      />
    </div>
  );
}
