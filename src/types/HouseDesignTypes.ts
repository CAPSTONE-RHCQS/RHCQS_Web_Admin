export interface HouseDesign {
  Id: string;
  ProjectId: string;
  Name: string;
  Step: number;
  Status: string;
  Type: string;
  IsCompany: boolean;
  InsDate: string;
  Versions: any[];
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
  Versions: VersionDetail[];
}
