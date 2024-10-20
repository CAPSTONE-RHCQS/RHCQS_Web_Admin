export interface PackageQuotation {
  IdPackageRough: string;
  PackageRough: string;
  UnitPackageRough: number;
  IdPackageFinished: string;
  PackageFinished: string;
  UnitPackageFinished: number;
  Unit: string;
}

export interface ItemInitial {
  Id: string;
  Name: string;
  SubConstruction: string | null;
  Area: number;
  Price: number;
  UnitPrice: string;
  SubCoefficient: number | null;
  Coefficient: number;
}

export interface UtilityInfo {
  Id: string;
  Description: string;
  Coefficient: number;
  Price: number;
}

export interface PromotionInfo {
  Id: string;
  Name: string;
  Value: number;
}

export interface BatchPaymentInfo {
  Id: string;
  Description: string;
  Percents: string;
  Price: number;
  Unit: string;
}

export interface InitialQuotationResponse {
  Id: string;
  AccountName: string;
  ProjectId: string;
  PromotionId: string;
  PackageId: string;
  Area: number;
  TimeProcessing: string | null;
  TimeOthers: string | null;
  OthersAgreement: string | null;
  InsDate: string;
  Status: string;
  Version: number;
  Deflag: boolean;
  Note: string | null;
  TotalRough: number;
  TotalUtilities: number;
  Unit: string;
  ReasonReject: string | null;
  PackageQuotationList: PackageQuotation;
  ItemInitial: ItemInitial[];
  UtilityInfos: UtilityInfo[];
  PromotionInfo: PromotionInfo | null;
  BatchPaymentInfos: BatchPaymentInfo[];
}
