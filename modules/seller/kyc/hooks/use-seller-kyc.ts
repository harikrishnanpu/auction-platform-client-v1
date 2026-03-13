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
} from '@/types/kyc.type';
import { useRouter } from 'next/navigation';

export function useSellerKyc(
  initialStatus: string,
  initialProfile: KycProfile | null
) {
  const router = useRouter();

  const [status, setStatus] = useState<string>(
    initialStatus || KycStatusEnum.PENDING
  );
  const [loading, setLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (!initialProfile || initialStatus === KycStatusEnum.REJECTED) return [];

    const files: UploadedFile[] = [];
    initialProfile.documents?.forEach((doc) => {
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
  });

  const [livenessCompleted, setLivenessCompleted] = useState(() => {
    if (!initialProfile || initialStatus === 'REJECTED') return false;
    return (
      initialProfile.status === KycStatusEnum.PENDING ||
      initialProfile.status === KycStatusEnum.APPROVED ||
      initialStatus === KycStatusEnum.SUBMITTED
    );
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const rejectReason = initialProfile?.rejection_reason_message || null;

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFiles((prev) => [
      ...prev.filter(
        (f) =>
          !(
            f.documentType === file.documentType &&
            f.documentSide === file.documentSide
          )
      ),
      file,
    ]);
  };

  const handleRemoveDocument = (
    documentType: DocumentType,
    documentSide?: DocumentSide
  ) => {
    setUploadedFiles((prev) =>
      prev.filter(
        (f) =>
          !(f.documentType === documentType && f.documentSide === documentSide)
      )
    );
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
      // await kycService.submitKyc('SELLER');
      setShowSuccessModal(true);
      setStatus('PENDING');
      window.scrollTo(0, 0);
    } catch (error) {
      console.log('Submit error:', error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to submit KYC';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setStatus('PENDING');
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
