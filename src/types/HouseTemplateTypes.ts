export interface TemplateItem {
  Id: string;
  ConstructionId: string;
  SubConstructionId: string | null;
  Name: string;
  Coefficient: number;
  Area: number;
  Unit: string;
  InsDate: string | null;
}

export interface DesignDrawing {
  Id: string;
  Name: string;
  Url: string;
  InsDate: string;
  UpsDate: string;
}

export interface SubTemplate {
  Id: string;
  BuildingArea: number;
  FloorArea: number;
  InsDate: string | null;
  Size: string;
  Url: string;
  TemplateItems: TemplateItem[];
  Designdrawings: DesignDrawing[];
}

export interface PackageHouse {
  Id: string;
  PackageId: string;
  PackageName: string;
  ImgUrl: string | null;
  InsDate: string;
  Description: string;
}

export interface ExteriorUrl {
  Id: string;
  Name: string;
  Url: string;
  InsDate: string;
  UpsDate: string;
}

export interface HouseTemplateItem {
  Id: string;
  Name: string;
  Description: string;
  NumberOfFloor: number;
  NumberOfBed: number;
  NumberOfFront: number | null;
  ImgUrl: string;
  InsDate: string | null;
  SubTemplates: SubTemplate[];
  PackageHouses: PackageHouse[];
  ExteriorsUrls: ExteriorUrl[];
}

export interface HouseTemplateResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: HouseTemplateItem[];
}

export interface HouseTemplateDetail {
  Id: string;
  Name: string;
  Description: string;
  NumberOfFloor: number;
  NumberOfBed: number;
  NumberOfFront: number | null;
  ImgUrl: string;
  InsDate: string | null;
  SubTemplates: SubTemplate[];
  PackageHouses: PackageHouse[];
  ExteriorsUrls: ExteriorUrl[];
} 

// Interfaces for creating a new house template
export interface CreateHouseTemplateRequest {
  name: string;
  description: string;
  numberOfFloor: number;
  numberOfBed: number;
  packageRoughId: string;
  descriptionPackage: string;
  subTemplates: CreateSubTemplate[];
}

export interface CreateSubTemplate {
  buildingArea: number;
  floorArea: number;
  size: string;
  totalRough: number;
  templateItems: CreateTemplateItem[];
}

export interface CreateTemplateItem {
  constructionItemId: string;
  subConstructionItemId: string | null;
  name: string;
  area: number;
  unit: string;
}

export interface AddImageHouseTemplateRequest {
  id: string;
  imgUrl: string;
}
