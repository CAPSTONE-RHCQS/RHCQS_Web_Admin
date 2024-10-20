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
  SubConstructionId: string | null;
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

export interface Item {
  name: string;
  constructionItemId: string;
  subConstructionId: string | null;
  area: number;
  price: number;
}

export interface Package {
  packageId: string;
  type: string;
}

export interface Utility {
  utilitiesItemId: string;
  coefiicient: number;
  price: number;
  description: string;
}

export interface Promotion {
  id: string | null;
}

export interface BatchPayment {
  price: number;
  percents: string;
  description: string;
}

export interface UpdateInitialQuotationRequest {
  versionPresent: number;
  projectId: string;
  area: number;
  timeProcessing: number;
  timeRough: number;
  timeOthers: number;
  othersAgreement: string;
  totalRough: number;
  totalUtilities: number;
  items: Item[];
  packages: Package[];
  utilities: Utility[];
  promotions: Promotion | null;
  batchPayments: BatchPayment[];
}
