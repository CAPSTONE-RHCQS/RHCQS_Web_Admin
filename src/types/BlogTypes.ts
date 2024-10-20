export interface BlogItem {
  Id: string;
  AccountName: string;
  RoleName: string;
  Heading: string;
  SubHeading: string;
  Context: string;
  ImgUrl: string;
  InsDate: string;
  UpsDate: string | null;
}

export interface BlogResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: BlogItem[];
}

