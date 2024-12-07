export interface Quotation {
  QuotationlId: string;
  Version: number;
  File: string;
}

export interface BatchPayment {
  BatchPaymentId: string;
  PaymentId: string;
  NumberOfBatch: number;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Percents: number;
  Description: string;
  Status: string;
  InvoiceImage: string;
}

export interface BatchPaymentAppendix {
  PaymentId: string;
  NumberOfBatch: number;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Percents: number;
  Description: string;
  Status: string;
  InvoiceImage: string;
}

export interface ContractDesignResponse {
  ProjectId: string;
  Name: string;
  CustomerName: string;
  ContractCode: string;
  StartDate: string;
  EndDate: string;
  ValidityPeriod: number;
  TaxCode: string | null;
  Area: number;
  UnitPrice: string;
  ContractValue: number;
  UrlFile: string;
  Note: string | null;
  Deflag: boolean;
  RoughPackagePrice: number;
  FinishedPackagePrice: number;
  Status: string;
  Type: string;
  InsDate: string;
  Quotation: Quotation;
  BatchPayment: BatchPayment[];
  BatchPaymentAppendices: BatchPaymentAppendix[];
}

export interface BatchPaymentRequest {
  NumberOfBatches: number;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Percents: number;
  Description: string;
}

export interface FinalToContractResponse {
  ProjectId: string;
  Type: string;
  StartDate: string | null;
  EndDate: string | null;
  ValidityPeriod: number | null;
  TaxCode: string | null;
  ContractValue: number;
  UrlFile: string | null;
  Note: string | null;
  BatchPaymentRequests: BatchPaymentRequest[];
}
