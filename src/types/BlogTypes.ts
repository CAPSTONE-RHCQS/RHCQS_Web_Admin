export interface BlogItem {
  Id: string;
  AccountName: string;
  RoleName: string;
  Heading: string | null;
  SubHeading: string | null;
  Context: string | null;
  ImgUrl: string | null;
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
