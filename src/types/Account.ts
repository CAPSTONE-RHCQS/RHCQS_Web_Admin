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
  avatar: string;
  accountName: string;
  role: string;
  birthday: string;
  address: string;
  isChecked: boolean;
  deflag: boolean;
  [key: string]: any;
};
