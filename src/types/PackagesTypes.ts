export interface Package {
  Id: string;
  PackageName: string;
  Unit: string;
  Price: number;
  Status: string;
  InsDate: string;
  UpsDate: string | null;
  PackageLabors: PackageLabor[];
  PackageMaterials: PackageMaterial[];
  PackageHouses: PackageHouse[];
  PackageType: string;
}

export interface PackageLabor {
  Id: string;
  LaborId: string;
  NameOfLabor: string;
  Type: string;
  Price: number;
  InsDate: string;
}

export interface PackageMaterial {
  Id: string;
  MaterialSectionId: string;
  MaterialSectionName: string;
  MaterialName: string;
  Type: string;
  Price: number;
  Unit: string;
  Size: string | null;
  Shape: string | null;
  ImgUrl: string | null;
  Description: string | null;
  InsDate: string;
}

export interface PackageHouse {
  Id: string;
  DesignTemplateId: string;
  ImgUrl: string | null;
  InsDate: string;
}
