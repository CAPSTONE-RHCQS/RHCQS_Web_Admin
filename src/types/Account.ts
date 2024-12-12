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

export interface Role {
  Id: string;
  RoleName: string;
  Accounts: any[];
}

export interface Profile {
  Id: string;
  RoleId: string;
  Email: string;
  Username: string;
  ImageUrl: string;
  PasswordHash: string;
  PhoneNumber: string;
  DateOfBirth: string;
  InsDate: string;
  UpsDate: string;
  Deflag: boolean;
  AssignTasks: any[];
  Blogs: any[];
  Customers: any[];
  HouseDesignDrawings: any[];
  Messages: any[];
  Role: Role;
  RoomReceivers: any[];
  RoomSenders: any[];
}
