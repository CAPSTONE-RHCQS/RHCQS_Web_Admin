export interface InitialInfo {
  Id: string;
  AccountName: string;
  Version: number;
  InsDate: string;
  Status: string;
}

export interface HouseDesignDrawingInfo {
  Id: string;
  Step: number;
  Name: string;
  Type: string;
  InsDate: string;
  Status: string;
  DesignName: string;
}

export interface FinalInfo {
  Id: string;
  AccountName: string;
  Version: number | null;
  InsDate: string | null;
  Status: string;
}

export interface ContractInfo {
  Id: string;
  Name: string;
  Status: string;
  Note: string | null;
  FileContract: string | null;
}

export interface ProjectDetail {
  Id: string;
  Name: string;
  Phone: string;
  Avatar: string;
  AccountName: string;
  Address: string;
  PhoneNumber: string | null;
  Mail: string;
  Area: number;
  Type: string;
  Status: string;
  InsDate: string;
  UpsDate: string;
  ProjectCode: string;
  StaffName: string;
  StaffPhone: string;
  StaffAvatar: string;
  IsDrawing: boolean;
  InitialInfo: InitialInfo[];
  HouseDesignDrawingInfo: HouseDesignDrawingInfo[];
  FinalInfo: FinalInfo[];
  ContractInfo: ContractInfo[];
}
