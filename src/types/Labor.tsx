export interface LaborResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: LaborItem[];
}

export interface LaborItem {
  Id: string;
  Name: string;
  Price: number;
  InsDate: string;
  UpsDate: string;
  Deflag: boolean;
  Type: string;
}
