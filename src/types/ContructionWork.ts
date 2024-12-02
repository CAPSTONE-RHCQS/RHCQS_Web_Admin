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
  MaterialFinishedCost: number
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