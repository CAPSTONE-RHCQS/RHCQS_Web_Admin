export interface BatchPaymentInfo {
  PaymentId: string;
  PaymentTypeId: string;
  PaymentTypeName: string;
  ContractId: string | null;
  InsDate: string;
  Status: string;
  UpsDate: string | null;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Unit: string;
  Percents: number;
  Description: string;
  NumberOfBatch: number;
}

export interface EquipmentItem {
  Id: string;
  Name: string;
  Unit: string;
  Quantity: number;
  UnitOfMaterial: number;
  TotalOfMaterial: number;
  Note: string;
  Type: string;
}

export interface QuotationItem {
  Id: string;
  WorkTemplateId: string | null;
  WorkName: string;
  Unit: string;
  Weight: number;
  UnitPriceLabor: number | null;
  UnitPriceRough: number | null;
  UnitPriceFinished: number | null;
  TotalPriceLabor: number | null;
  TotalPriceRough: number | null;
  TotalPriceFinished: number | null;
  InsDate: string | null;
  UpsDate: string | null;
  Note: string | null;
}

export interface FinalQuotationItem {
  Id: string;
  ConstructionId: string;
  SubConstructionId: string | null;
  ContructionName: string;
  Area: number | null;
  Type: string;
  InsDate: string;
  QuotationItems: QuotationItem[];
}

export interface PromotionInfo {
  Id: string;
  Name: string;
  Value: number;
}

export interface UtilityInfo {
  Id: string;
  utilitiesItemId: string | null;
  utilitiesSectionId: string;
  Name: string;
  Description: string;
  Coefficient: number;
  Price: number;
  UnitPrice: number;
  Unit: string;
  Quantity: number | null;
}

export interface ConstructionDetail {
  Type: string | null;
  TotalPriceRough: number;
  TotalPriceLabor: number;
}

export interface Equitment {
  Type: string;
  TotalPriceRough: number;
  TotalPriceLabor: number;
}

export interface HouseDrawingVersionInfo {
  VersionId: string;
  VersionName: string;
  Version: number;
}

export interface PackageQuotationList {
  IdPackageRough: string | null;
  PackageRough: string | null;
  UnitPackageRough: number;
  IdPackageFinished: string | null;
  PackageFinished: string | null;
  UnitPackageFinished: number;
  Unit: string;
}

export interface FinalQuotationDetail {
  Id: string;
  AccountName: string;
  Address: string;
  ProjectId: string;
  Area: number;
  InitailQuotationId: string;
  InitailQuotationVersion: number;
  HouseDrawingVersionInf: HouseDrawingVersionInfo[];
  ProjectType: string;
  ProjectAddress: string;
  Discount: number | null;
  TotalPrice: number;
  Note: string | null;
  OthersAgreement: string | null;
  Version: number;
  InsDate: string;
  UpsDate: string | null;
  Status: string;
  Deflag: boolean;
  ReasonReject: string | null;
  PackageQuotationList: PackageQuotationList;
  BatchPaymentInfos: BatchPaymentInfo[];
  EquipmentItems: EquipmentItem[];
  FinalQuotationItems: FinalQuotationItem[];
  PromotionInfo: PromotionInfo | null;
  UtilityInfos: UtilityInfo[];
  ConstructionRough: ConstructionDetail;
  ConstructionFinished: ConstructionDetail;
  Equitment: Equitment;
}

export interface FinalQuotationResponse extends FinalQuotationDetail {}
