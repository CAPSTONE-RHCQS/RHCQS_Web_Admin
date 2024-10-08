import requestWebDriver from '../../utils/axios';

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

export const getAccounts = async (page: number, size: number) => {
  try {
    const response = await requestWebDriver.get(`/account`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const getAccountById = async (id: string) => {
  try {
    const response = await requestWebDriver.get(`/account/id`, {
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
    const response = await requestWebDriver.put(`/account/id?id=${account.Id}`, account, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const updateDeflag = async (id: string) => {
  try {
    const response = await requestWebDriver.put(`/account/updatedeflag/id`, null, {
      params: { id },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating deflag:', error);
    throw error;
  }
};

export const getTotalAccounts = async () => {
  try {
    const response = await requestWebDriver.get(`/account/total-account`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total accounts:', error);
    throw error;
  }
};

export const getAccountsByRoleId = async (id: string, page: number, size: number) => {
  try {
    const response = await requestWebDriver.get(`/account/roleid`, {
      params: { id, page, size },
      headers: {
        'accept': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts by role id:', error);
    throw error;
  }
};