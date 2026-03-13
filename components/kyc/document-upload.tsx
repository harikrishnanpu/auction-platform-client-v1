'use client';

import { useState, useRef } from 'react';
import {
  Fingerprint,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import {
  generateKycUploadUrlAction,
  updateKycAction,
  uploadKycToS3Action,
} from '@/actions/kyc/kyc.action';
import { DocumentSide, DocumentType, KycFor } from '@/types/kyc.type';
import { getErrorMessage } from '@/utils/get-app-error';
import Image from 'next/image';

export interface UploadedFile {
  documentType: DocumentType;
  documentSide?: DocumentSide;
  fileKey: string;
  fileName: string;
  fileSize: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

interface DocumentUploadProps {
  uploadedFiles: UploadedFile[];
  onUploadSuccess: (file: UploadedFile) => void;
  onRemoveDocument?: (
    documentType: DocumentType,
    documentSide?: DocumentSide
  ) => void;
  kycType?: 'SELLER' | 'MODERATOR';
}

export function DocumentUpload({
  uploadedFiles,
  onUploadSuccess,
  onRemoveDocument,
  kycType = 'SELLER',
}: DocumentUploadProps) {
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<
    Record<string, string | null>
  >({});

  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const addressProofInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    file: File | null,
    documentType: DocumentType,
    documentSide: DocumentSide,
    setFile: (file: File | null) => void
  ) => {
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPEG, PNG, or PDF files only.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setFile(file);
    setUploadErrors((prev) => ({
      ...prev,
      [documentType + '_' + documentSide]: null,
    }));
  };

  const handleUpload = async (
    file: File,
    documentType: DocumentType,
    documentSide: DocumentSide
  ) => {
    if (!file) return;

    setUploading(documentType + '_' + documentSide);
    setUploadErrors((prev) => ({
      ...prev,
      [documentType + '_' + documentSide]: null,
    }));

    try {
      const response = await generateKycUploadUrlAction({
        kycFor: KycFor.SELLER,
        contentType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate upload URL');
      }

      const { uploadUrl, fileKey } = response.data;

      // alert("UPLOAD URL:" + uploadUrl);
      // alert("FILE KEY:" + fileKey);

      const uploadToS3Response = await uploadKycToS3Action({
        uploadUrl: uploadUrl,
        file: file,
      });

      if (!uploadToS3Response.success) {
        throw new Error(uploadToS3Response.error || 'Failed to upload to S3');
      }

      const updateKycResponse = await updateKycAction({
        kycFor: KycFor.SELLER,
        documentType: documentType,
        fileKey: fileKey,
        side: documentSide,
      });

      console.log('RESPONSE: CHECK:', updateKycResponse);

      if (!updateKycResponse.success || !updateKycResponse.data) {
        throw new Error(updateKycResponse.error || 'Failed to update kyc');
      }

      onUploadSuccess({
        documentType,
        documentSide,
        fileKey,
        fileName: file.name,
        fileSize: file.size,
        status: 'success',
      });

      if (
        documentType === DocumentType.ID &&
        documentSide === DocumentSide.FRONT
      ) {
        setIdFrontFile(null);
        if (idFrontInputRef.current) idFrontInputRef.current.value = '';
      } else if (
        documentType === DocumentType.ID &&
        documentSide === DocumentSide.BACK
      ) {
        setIdBackFile(null);
        if (idBackInputRef.current) idBackInputRef.current.value = '';
      } else if (documentType === DocumentType.ADDRESS_PROOF) {
        setAddressProofFile(null);
        if (addressProofInputRef.current)
          addressProofInputRef.current.value = '';
      }
    } catch (error: unknown) {
      console.log('Upload Error:', error);

      setUploadErrors((prev) => ({
        ...prev,
        [documentType + '_' + documentSide]:
          getErrorMessage(error) || 'Failed to generate upload URL',
      }));

      onUploadSuccess({
        documentType,
        documentSide,
        fileKey: '',
        fileName: file.name,
        fileSize: file.size,
        status: 'error',
      });
    } finally {
      setUploading(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getUploadedFile = (
    documentType: DocumentType,
    documentSide?: DocumentSide
  ) => {
    return uploadedFiles.find(
      (f) =>
        f.documentType === documentType &&
        (documentSide ? f.documentSide === documentSide : true)
    );
  };

  const getFileUrl = (fileKey: string) => {
    if (!fileKey) return '';
    if (fileKey.startsWith('http')) return fileKey;
    return `https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com/${fileKey}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Fingerprint size={128} className="text-foreground" strokeWidth={1} />
      </div>
      <h2 className="text-xl font-bold font-sans mb-1 text-foreground">
        Identity Verification
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload a government-issued ID and proof of address to comply with seller
        regulations.
      </p>

      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Government ID (Aadhar / PAN / Passport)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                ref={idFrontInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={(e) =>
                  handleFileSelect(
                    e.target.files?.[0] || null,
                    DocumentType.ID,
                    DocumentSide.FRONT,
                    setIdFrontFile
                  )
                }
                disabled={
                  uploading === DocumentType.ID + '_' + DocumentSide.FRONT
                }
              />
              <div
                onClick={() => !uploading && idFrontInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  uploading === DocumentType.ID + '_' + DocumentSide.FRONT
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-wait'
                    : idFrontFile ||
                        getUploadedFile(DocumentType.ID, DocumentSide.FRONT)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-border hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-muted/50'
                }`}
              >
                {uploading === DocumentType.ID + '_' + DocumentSide.FRONT ? (
                  <>
                    <Loader2 className="mx-auto h-8 w-8 text-blue-500 mb-2 animate-spin" />
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Uploading...
                    </p>
                  </>
                ) : getUploadedFile(DocumentType.ID, DocumentSide.FRONT)
                    ?.status === 'success' ? (
                  <div className="relative group rounded-xl overflow-hidden w-full h-[140px] bg-muted/20 flex flex-col items-center justify-center border border-border">
                    <div className="w-full h-full relative flex items-center justify-center p-2">
                      {getUploadedFile(DocumentType.ID, DocumentSide.FRONT)
                        ?.fileName?.toLowerCase()
                        .includes('pdf') ||
                      getUploadedFile(DocumentType.ID, DocumentSide.FRONT)
                        ?.fileKey?.toLowerCase()
                        .includes('pdf') ? (
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            PDF Document
                          </p>
                        </div>
                      ) : (
                        <Image
                          src={getFileUrl(
                            getUploadedFile(DocumentType.ID, DocumentSide.FRONT)
                              ?.fileKey || ''
                          )}
                          alt="Front ID Preview"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRemoveDocument)
                            onRemoveDocument(
                              DocumentType.ID,
                              DocumentSide.FRONT
                            );
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-transform transform active:scale-95"
                      >
                        <Trash2 size={16} />
                        Remove File
                      </button>
                    </div>
                  </div>
                ) : idFrontFile ? (
                  <>
                    <FileText className="mx-auto h-8 w-8 text-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {idFrontFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(idFrontFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload(
                          idFrontFile,
                          DocumentType.ID,
                          DocumentSide.FRONT
                        );
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Upload
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Click to upload Front Side
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or PDF up to 5MB
                    </p>
                  </>
                )}
              </div>
              {uploadErrors[DocumentType.ID + '_' + DocumentSide.FRONT] && (
                <p className="text-sm font-medium text-red-500 mt-2">
                  {uploadErrors[DocumentType.ID + '_' + DocumentSide.FRONT]}
                </p>
              )}
            </div>

            <div>
              <input
                ref={idBackInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={(e) =>
                  handleFileSelect(
                    e.target.files?.[0] || null,
                    DocumentType.ID,
                    DocumentSide.BACK,
                    setIdBackFile
                  )
                }
                disabled={
                  uploading === DocumentType.ID + '_' + DocumentSide.BACK
                }
              />
              <div
                onClick={() => !uploading && idBackInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  uploading === DocumentType.ID + '_' + DocumentSide.BACK
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-wait'
                    : idBackFile ||
                        getUploadedFile(DocumentType.ID, DocumentSide.BACK)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-border hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-muted/50'
                }`}
              >
                {uploading === DocumentType.ID + '_' + DocumentSide.BACK ? (
                  <>
                    <Loader2 className="mx-auto h-8 w-8 text-blue-500 mb-2 animate-spin" />
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Uploading...
                    </p>
                  </>
                ) : getUploadedFile(DocumentType.ID, DocumentSide.BACK)
                    ?.status === 'success' ? (
                  <div className="relative group rounded-xl overflow-hidden w-full h-[140px] bg-muted/20 flex flex-col items-center justify-center border border-border">
                    <div className="w-full h-full relative flex items-center justify-center p-2">
                      {getUploadedFile(DocumentType.ID, DocumentSide.BACK)
                        ?.fileName?.toLowerCase()
                        .includes('pdf') ||
                      getUploadedFile(DocumentType.ID, DocumentSide.BACK)
                        ?.fileKey?.toLowerCase()
                        .includes('pdf') ? (
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            PDF Document
                          </p>
                        </div>
                      ) : (
                        <Image
                          src={getFileUrl(
                            getUploadedFile(DocumentType.ID, DocumentSide.BACK)
                              ?.fileKey || ''
                          )}
                          alt="Back ID Preview"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRemoveDocument)
                            onRemoveDocument(
                              DocumentType.ID,
                              DocumentSide.BACK
                            );
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-transform transform active:scale-95"
                      >
                        <Trash2 size={16} />
                        Remove File
                      </button>
                    </div>
                  </div>
                ) : idBackFile ? (
                  <>
                    <FileText className="mx-auto h-8 w-8 text-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {idBackFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(idBackFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload(
                          idBackFile,
                          DocumentType.ID,
                          DocumentSide.BACK
                        );
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Upload
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Click to upload Back Side
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or PDF up to 5MB
                    </p>
                  </>
                )}
              </div>
              {uploadErrors[DocumentType.ID + '_' + DocumentSide.BACK] && (
                <p className="text-sm font-medium text-red-500 mt-2">
                  {uploadErrors[DocumentType.ID + '_' + DocumentSide.BACK]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Proof of Address
          </label>
          <input
            ref={addressProofInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={(e) =>
              handleFileSelect(
                e.target.files?.[0] || null,
                DocumentType.ADDRESS_PROOF,
                DocumentSide.FRONT,
                setAddressProofFile
              )
            }
            disabled={
              uploading ===
              DocumentType.ADDRESS_PROOF + '_' + DocumentSide.FRONT
            }
          />
          <div
            onClick={() => !uploading && addressProofInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
              uploading ===
              DocumentType.ADDRESS_PROOF + '_' + DocumentSide.FRONT
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-wait'
                : addressProofFile ||
                    getUploadedFile(
                      DocumentType.ADDRESS_PROOF,
                      DocumentSide.FRONT
                    )
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-border hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-muted/50'
            }`}
          >
            {uploading ===
            DocumentType.ADDRESS_PROOF + '_' + DocumentSide.FRONT ? (
              <div className="flex items-center gap-4">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Uploading...
                  </p>
                </div>
              </div>
            ) : getUploadedFile(DocumentType.ADDRESS_PROOF, DocumentSide.FRONT)
                ?.status === 'success' ? (
              <div className="flex items-center gap-4 bg-muted/20 p-2 rounded-xl group relative overflow-hidden border border-border/50 transition-colors hover:border-border">
                <div className="w-16 h-16 shrink-0 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center border border-border shadow-sm overflow-hidden p-1">
                  {getUploadedFile(
                    DocumentType.ADDRESS_PROOF,
                    DocumentSide.FRONT
                  )
                    ?.fileName?.toLowerCase()
                    .includes('pdf') ||
                  getUploadedFile(
                    DocumentType.ADDRESS_PROOF,
                    DocumentSide.FRONT
                  )
                    ?.fileKey?.toLowerCase()
                    .includes('pdf') ? (
                    <FileText className="h-8 w-8 text-green-500" />
                  ) : (
                    <Image
                      src={getFileUrl(
                        getUploadedFile(
                          DocumentType.ADDRESS_PROOF,
                          DocumentSide.FRONT
                        )?.fileKey || ''
                      )}
                      alt="Address Proof Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-10">
                  <p className="text-sm font-medium text-foreground truncate">
                    {
                      getUploadedFile(
                        DocumentType.ADDRESS_PROOF,
                        DocumentSide.FRONT
                      )?.fileName
                    }
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle size={12} />
                    Verified Upload
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveDocument)
                      onRemoveDocument(
                        DocumentType.ADDRESS_PROOF,
                        DocumentSide.FRONT
                      );
                  }}
                  className="absolute right-4 rounded-full p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                  title="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : addressProofFile ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {addressProofFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(addressProofFile.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload(
                      addressProofFile,
                      DocumentType.ADDRESS_PROOF,
                      DocumentSide.FRONT
                    );
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Click to upload proof of address
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or PDF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
          {uploadErrors[
            DocumentType.ADDRESS_PROOF + '_' + DocumentSide.FRONT
          ] && (
            <p className="text-sm font-medium text-red-500 mt-2">
              {
                uploadErrors[
                  DocumentType.ADDRESS_PROOF + '_' + DocumentSide.FRONT
                ]
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
