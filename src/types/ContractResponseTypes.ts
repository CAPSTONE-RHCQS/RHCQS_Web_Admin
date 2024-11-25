export interface Quotation {
  QuotationlId: string;
  Version: number;
  File: string;
}

export interface BatchPayment {
  PaymentId: string;
  NumberOfBatch: number;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Percents: number;
  Description: string;
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
}
