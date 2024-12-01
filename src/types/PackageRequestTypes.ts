export interface PackageLabor {
  laborId: string;
}

export interface PackageMaterial {
  materialId: string;
}

export interface PackageHouse {
  designTemplateId: string;
  imgUrl: string;
  description: string | null;
}

export interface PackagePutRequest {
  packageType: string;
  packageName: string;
  unit: string;
  price: number;
  status: string;
  packageLabors: PackageLabor[];
  packageMaterials: PackageMaterial[];
  packageHouses: PackageHouse[];
}
