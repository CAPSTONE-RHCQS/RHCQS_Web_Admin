import { Profile } from '../../types/Account';
import requestWebRHCQS from '../../utils/axios';

interface AccountUpdateRequest {
  Id: string;
  RoleId: string;
  Email: string;
  Username: string;
  ImageUrl: string;
  PasswordHash: string;
  PhoneNumber: string | null;
  DateOfBirth: string | null;
  InsDate: string;
  UpsDate: string;
  Deflag: boolean;
}

export interface ProfileUpdateRequest {
  Id?: string;
  Username?: string;
  PhoneNumber?: string;
  DateOfBirth: string;
  Deflag?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const getAccounts = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/account`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await requestWebRHCQS.get(`/account/profile`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getAccountById = async (id: string) => {
  try {
    const response = await requestWebRHCQS.get(`/account/id`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching account by id:', error);
    throw error;
  }
};

export const updateAccount = async (account: AccountUpdateRequest) => {
  try {
    const response = await requestWebRHCQS.put(
      `/account/id?id=${account.Id}`,
      account,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const updateDeflag = async (id: string) => {
  try {
    const response = await requestWebRHCQS.put(
      `/account/updatedeflag/id`,
      null,
      {
        params: { id },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating deflag:', error);
    throw error;
  }
};

export const getTotalAccounts = async () => {
  try {
    const response = await requestWebRHCQS.get(`/account/total-account`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total accounts:', error);
    throw error;
  }
};

export const getAccountsByRoleId = async (
  id: string,
  page: number,
  size: number,
) => {
  try {
    const response = await requestWebRHCQS.get(`/account/roleid`, {
      params: { id, page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts by role id:', error);
    throw error;
  }
};

export const getAvailableSalesStaff = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/task/sale-staff/available?`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts by role id:', error);
    throw error;
  }
};

export const createStaff = async (
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
  role: string,
) => {
  try {
    const response = await requestWebRHCQS.post(
      `/account/create-staff`,
      {
        email,
        phoneNumber,
        password,
        confirmPassword,
      },
      {
        params: { role },
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

export const updateAccountProfile = async (
  id: string,
  updateData: ProfileUpdateRequest,
): Promise<Profile> => {
  try {
    const response = await requestWebRHCQS.put(`/account/id`, updateData, {
      params: { id },
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating account profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (
  file: File,
  accountId?: string,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('AccountImage', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: 'text/plain',
      },
      params: accountId ? { accountId } : {},
    };

    const response = await requestWebRHCQS.post(
      '/upload-profile-images',
      formData,
      config,
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export const changePassword = async (
  passwordData: ChangePasswordRequest,
): Promise<any> => {
  try {
    const response = await requestWebRHCQS.put(
      '/account/password',
      passwordData,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const searchAccounts = async (
  searchKey: string,
  page: number = 1,
  size: number = 5,
) => {
  try {
    const response = await requestWebRHCQS.get(`/account/key`, {
      params: {
        searchKey,
        page,
        size,
      },
      headers: {
        accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching accounts:', error);
    throw error;
  }
};
