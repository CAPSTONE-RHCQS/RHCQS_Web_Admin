export type Account = {
  id: string;
  roleId: string;
  email: string;
  username: string;
  imageUrl: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  insDate: string;
  upsDate: string;
  deflag: boolean;
  roleName: string;
  [key: string]: any;
};
