export interface HouseDesign {
  Id: string;
  ProjectId: string;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  Versions: VersionDetail[];
}

export interface HouseDesignResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: HouseDesign[];
}

export interface VersionDetail {
  Id: string;
  Name: string;
  Version: number;
  FileUrl: string;
  InsDate: string;
  PreviousDrawingId: string | null;
  NamePrevious: string | null;
  Note: string | null;
  Reason: string | null;
}

export interface DependOnVersion {
  HouseDesginVersionId: string;
  HouseDesignVersionName: string;
  HouseDesignVersion: number;
  FileDesignVersion: string;
}

export interface HouseDesignDetailResponse {
  Id: string;
  ProjectId: string;
  StaffName: string;
  VersionPresent: number;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  DependOnVersion: DependOnVersion[];
  Versions: VersionDetail[];
}
