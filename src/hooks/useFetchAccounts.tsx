import { useState, useEffect } from 'react';
import { getAccounts, getAccountsByRoleId, getTotalAccounts } from '../api/Account/Account';
import { Account } from '../types/Account';

const roleMapping: { [key: string]: string } = {
  '9959ce96-de26-40a7-b8a7-28a704062e89': 'Sales Staff',
  '7af0d75e-1157-48b4-899d-3196deed5fad': 'Design Staff',
  'a3bb42ca-de7c-4c9f-8f58-d8175f96688c': 'Manager',
  '789dd57d-0f75-40d1-8366-ef6ab582efc8': 'Customer',
};

const useFetchAccounts = (currentPage: number, refreshKey: number, selectedRole: string) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        let data;
        if (selectedRole === '') {
          data = await getAccounts(currentPage, 10);
        } else {
          data = await getAccountsByRoleId(selectedRole, currentPage, 10);
        }
        const formattedData = data.Items.map((item: any) => ({
          id: item.Id,
          roleId: item.RoleId,
          email: item.Email,
          username: item.Username,
          imageUrl: item.ImageUrl || 'default-avatar-url',
          phoneNumber: item.PhoneNumber || '',
          dateOfBirth: item.DateOfBirth
            ? new Date(item.DateOfBirth).toLocaleDateString()
            : '',
          insDate: item.InsDate,
          upsDate: item.UpsDate,
          avatar: item.ImageUrl || 'default-avatar-url',
          accountName: item.Username,
          role: roleMapping[item.RoleId] || 'Unknown',
          birthday: item.DateOfBirth
            ? new Date(item.DateOfBirth).toLocaleDateString()
            : '',
          address: '',
          isChecked: false,
          deflag: item.Deflag,
        }));
        setAccounts(formattedData);
        setTotalPages(data.TotalPages);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalAccounts = async () => {
      try {
        const total = await getTotalAccounts();
        setTotalAccounts(total);
      } catch (error) {
        console.error('Failed to fetch total accounts:', error);
      }
    };

    fetchAccounts();
    fetchTotalAccounts();
  }, [currentPage, refreshKey, selectedRole]);

  return { totalPages, totalAccounts, isLoading, accounts, setAccounts };
};

export default useFetchAccounts;