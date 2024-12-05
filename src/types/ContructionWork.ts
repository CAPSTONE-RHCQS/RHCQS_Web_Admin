export interface ConstructionWorkType {
  Size: number
  Page: number
  Total: number
  TotalPages: number
  Items: ConstructionWorkItem[]
}


export interface ConstructionWorkItem {
  Id: string
  WorkName: string
  ConstructionId: string
  InsDate: any
  Unit: string
  Code: string
  Resources: Resource[]
  WorkTemplates: WorkTemplate[]
}

export interface Resource {
  Id: string
  MaterialSectionName?: string
  MaterialSectionId?: string
  MaterialSectionNorm?: number
  LaborName?: string
  LaborId?: string
  LaborNorm?: number
  InsDate: any
}

export interface WorkTemplate {
  Id: string
  PackageId: string
  PackageName: string
  LaborCost: number
  MaterialCost: number
  MaterialFinishedCost: number | null
  TotalCost: number
  InsDate: any
}

export interface PackageConstructionWork {
  Id: string;
  PackageId: string;
  PackageName: string | null;
  LaborCost: number;
  MaterialCost: number;
  MaterialFinishedCost: number | null;
  TotalCost: number;
  InsDate: any;
}

export interface CreateConstructionWork {
  workName: string
  constructionId: string
  unit: string
  code: string
  resources: CreateConstructionWorkResource[]
}

export interface CreateConstructionWorkResource {
  materialSectionId: string | null
  materialSectionNorm: number | null
  laborId: string | null
  laborNorm: number | null
}

export type CreatePackageConstructionWorkRequest = CreatePackageConstructionWork[]

export interface CreatePackageConstructionWork {
  constructionWorkId: string
  packageId: string
  laborCost: number
  materialCost: number
  materialFinishedCost: number
  totalCost: number
}

export type SearchConstructionWorkResponse = SearchConstructionWorkItem[]

export interface SearchConstructionWorkItem {
  Name: string;
  ConstructionId: string;
}
