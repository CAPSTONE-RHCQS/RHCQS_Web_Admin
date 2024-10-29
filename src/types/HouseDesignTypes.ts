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
