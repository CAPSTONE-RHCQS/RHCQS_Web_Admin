export interface Package {
  Id: string;
  PackageTypeId: string;
  PackageName: string;
  Unit: string;
  Price: number;
  Status: string;
  InsDate: string;
  UpsDate: string | null;
  PackageDetails: PackageDetail[];
  PackageHouses: PackageHouse[];
  PackageType: {
    Id: string;
    Name: string;
    InsDate: string | null;
  };
}

export interface PackageDetail {
  Id: string;
  Action: string | null;
  Type: string;
  InsDate: string;
  PackageLabors: PackageLabor[];
  PackageMaterials: PackageMaterial[];
}

export interface PackageLabor {
  Id: string;
  LaborId: string;
  NameOfLabor: string;
  Type: string;
  TotalPrice: number;
  InsDate: string | null;
}

export interface PackageMaterial {
  Id: string;
  MaterialSectionId: string;
  MaterialSectionName: string;
  MaterialName: string | null;
  Price: number;
  Unit: string | null;
  Size: string | null;
  Shape: string | null;
  ImgUrl: string | null;
  Description: string | null;
  InsDate: string | null;
}

export interface PackageHouse {
  Id: string;
  DesignTemplateId: string;
  ImgUrl: string;
  InsDate: string;
}
