export interface Construction {
  Id: string;
  SubConstructionId: string;
  Name: string;
  Price: number;
  Coefficient: number;
}

export type GetConstructionByNameResponse = Construction[];

export interface Utility {
  UtilitySectionId: string;
  UtilityItemId: string;
  Name: string;
  Coefficient: number;
  UnitPrice: number;
}

export type GetUtilityByNameResponse = Utility[];

export interface Package {
  PackageId: string;
  PackageName: string;
  Type: string;
  Price: number;
}

export type GetPackageByNameResponse = Package[];

export interface Labor {
  Id: string;
  Name: string;
  Price: number;
  InsDate: string | null;
  UpsDate: string | null;
  Deflag: boolean;
  Type: string;
}

export type GetLaborByNameResponse = Labor[];

export interface Material {
  Id: string;
  Name: string;
  Price: number;
  Unit: string;
  Size: string;
  Shape: string;
  ImgUrl: string | null;
  Description: string | null;
  IsAvailable: boolean;
  UnitPrice: string;
  MaterialTypeName: string;
  MaterialSectionName: string;
  SupplierName: string;
}

export type GetMaterialByNameResponse = Material[];
