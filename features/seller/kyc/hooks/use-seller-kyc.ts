'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';
import React from 'react';
import { UploadedFile } from '@/components/kyc/document-upload';
import {
  KycProfile,
  KycStatusEnum,
  DocumentType,
  DocumentSide,
  KycFor,
} from '@/types/kyc.type';
import { useRouter } from 'next/navigation';
import useKycStore from '@/store/kyc.store';
import { submitKycAction } from '@/actions/kyc/kyc.action';
import { getErrorMessage } from '@/utils/get-app-error';

export function useSellerKyc() {
  const router = useRouter();

  const { kycProfile, kycStatus, setKycData } = useKycStore();

  const status =
    typeof kycStatus === 'string' ? kycStatus : KycStatusEnum.PENDING;
  const [loading, setLoading] = useState(false);

  const uploadedFiles = React.useMemo(() => {
    if (!kycProfile || status === KycStatusEnum.REJECTED) return [];

    const files: UploadedFile[] = [];
    kycProfile.documents?.forEach((doc) => {
      let docType: DocumentType | null = null;
      let side: DocumentSide | undefined = undefined;

      if (
        doc.documentType === DocumentType.ID ||
        (doc.documentType as string) === 'ID'
      ) {
        docType = DocumentType.ID;
        side = doc.side === 'FRONT' ? DocumentSide.FRONT : DocumentSide.BACK;
      } else if (
        doc.documentType === DocumentType.ADDRESS_PROOF ||
        (doc.documentType as string) === 'ADDRESS_PROOF'
      ) {
        docType = DocumentType.ADDRESS_PROOF;
        side = DocumentSide.FRONT;
      }

      if (docType) {
        files.push({
          documentType: docType,
          documentSide: side,
          fileKey: doc.documentUrl,
          fileName: doc.documentType,
          fileSize: 0,
          status: 'success',
        });
      }
    });
    return files;
  }, [kycProfile, status]);

  const [livenessCompleted, setLivenessCompleted] = useState(() => {
    if (!kycProfile || status === 'REJECTED') return false;
    return (
      kycProfile.status === KycStatusEnum.PENDING ||
      kycProfile.status === KycStatusEnum.APPROVED ||
      status === KycStatusEnum.SUBMITTED
    );
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const rejectReason = kycProfile?.rejection_reason_message || null;

  const handleUploadSuccess = (updatedKycData: {
    kyc: KycProfile;
    status: KycStatusEnum;
  }) => {
    if (updatedKycData) {
      setKycData(updatedKycData.kyc, updatedKycData.status);
    }
  };

  const handleRemoveDocument = async (
    documentType: DocumentType,
    documentSide?: DocumentSide
  ) => {
    if (kycProfile) {
      const updatedDocs = kycProfile.documents.filter((f) => {
        const isMatchType =
          (f.documentType as string) === (documentType as string) ||
          f.documentType === documentType;
        const isMatchSide =
          !documentSide ||
          (f.side as string) === (documentSide as string) ||
          f.side === documentSide;
        return !(isMatchType && isMatchSide);
      });
      setKycData(
        { ...kycProfile, documents: updatedDocs },
        kycStatus as string
      );
    }
  };

  const validateForm = () => {
    const errors = [];
    const hasIdFront = uploadedFiles.some(
      (f) =>
        f.documentType === DocumentType.ID &&
        f.documentSide === DocumentSide.FRONT &&
        f.status === 'success'
    );
    const hasIdBack = uploadedFiles.some(
      (f) =>
        f.documentType === DocumentType.ID &&
        f.documentSide === DocumentSide.BACK &&
        f.status === 'success'
    );
    const hasAddressProof = uploadedFiles.some(
      (f) =>
        f.documentType === DocumentType.ADDRESS_PROOF && f.status === 'success'
    );

    if (!hasIdFront) errors.push('Government ID (Front Side) is required');
    if (!hasIdBack) errors.push('Government ID (Back Side) is required');
    if (!hasAddressProof) errors.push('Proof of Address is required');
    if (!livenessCompleted)
      errors.push('Identity Liveness check must be completed');

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Please complete all verification steps', {
        icon: React.createElement(ShieldAlert, {
          className: 'text-red-500',
          size: 18,
        }),
      });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    if (loading) return;

    setValidationErrors([]);
    try {
      setLoading(true);
      await submitKycAction({ kycFor: KycFor.SELLER });
      setShowSuccessModal(true);
      setKycData(kycProfile as KycProfile, 'PENDING');
      window.scrollTo(0, 0);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setKycData(kycProfile as KycProfile, 'PENDING');
  };

  const retryLoad = () => {
    router.refresh();
  };

  const returnToDashboard = () => {
    router.push('/seller/landing');
  };

  return {
    status,
    loading,
    uploadedFiles,
    livenessCompleted,
    validationErrors,
    showSuccessModal,
    rejectReason,
    handleUploadSuccess,
    handleRemoveDocument,
    setLivenessCompleted,
    handleSubmit,
    handleModalClose,
    retryLoad,
    returnToDashboard,
  };
}
