export enum KycStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
  NOT_SUBMITTED = 'NOT_SUBMITTED',
}

export enum KycFor {
  SELLER = 'SELLER',
  MODERATOR = 'MODERATOR',
}

export enum DocumentType {
  ID = 'KYC_ID',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
}

export enum DocumentSide {
  FRONT = 'FRONT',
  BACK = 'BACK',
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IKycStatusOutput {
  kyc: KycProfile;
  status: KycStatusEnum;
}

export interface IKycDocumentResponseDto {
  id: string;
  kycId: string;
  documentType: DocumentType;
  side: DocumentSide;
  documentUrl: string;
  documentStatus: DocumentStatus;
}

export interface KycProfile {
  id: string;
  userId: string;
  status: KycStatusEnum;
  for: KycFor;
  documents: IKycDocumentResponseDto[];
}
