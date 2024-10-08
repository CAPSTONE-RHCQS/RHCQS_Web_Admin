export type Account = {
  Id: string;
  RoleId: string;
  Email: string;
  Username: string;
  ImageUrl: string;
  PhoneNumber: string | null;
  DateOfBirth: string | null;
  InsDate: string;
  UpsDate: string;
  deflag: boolean;
  roleName: string;
  [key: string]: any;
};
