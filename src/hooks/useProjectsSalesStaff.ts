import { useState, useEffect } from 'react';
import { getProjectsStaff } from '../api/Project/ProjectApi';
import axios from 'axios';

type Email = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
  isChecked: boolean;
};

type SortConfig = {
  key: string;
  direction: 'ascending' | 'descending';
};

const useProjectsSalesStaff = (currentPage: number, refreshKey: number) => {
  const [emails, setEmails] = useState<Email[]>([]); // Chỉ định kiểu Email[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchProjects = async (page: number) => {
      setLoading(true);
      try {
        const data = await getProjectsStaff(page, 10);
        if (data.Items.length === 0) {
          setError('Hiện tại chưa có dự án nào...');
        } else {
          const formattedData = data.Items.map((item: any) => ({
            id: item.Id,
            projectId: item.ProjectCode,
            projectName: item.Name,
            customerName: item.AccountName,
            category: item.Type,
            date: new Date(item.InsDate).toLocaleDateString('vi-VN'),
            status: item.Status,
            isChecked: false,
          }));
          setEmails(formattedData);
          setTotalPages(data.TotalPages);
          setError(null);
        }
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 403
        ) {
          setError(
            'Unauthorized access. You do not have permission to access this resource.',
          );
        } else {
          setError('Có lỗi xảy ra khi lấy dữ liệu dự án');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects(currentPage);
  }, [currentPage, refreshKey]);

  const handleSelectAll = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    setEmails(
      emails.map((email) => ({ ...email, isChecked: newIsAllChecked })),
    );
  };

  const handleCheckboxChange = (index: number) => {
    const newEmails = [...emails];
    newEmails[index].isChecked = !newEmails[index].isChecked;
    setEmails(newEmails);
    setIsAllChecked(newEmails.every((email) => email.isChecked));
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedEmails = [...emails].sort((a, b) => {
      const aValue = a[key as keyof Email];
      const bValue = b[key as keyof Email];

      if (
        key === 'date' &&
        typeof aValue === 'string' &&
        typeof bValue === 'string'
      ) {
        const dateA = new Date(aValue.split('.').reverse().join('-'));
        const dateB = new Date(bValue.split('.').reverse().join('-'));
        return direction === 'ascending'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    setEmails(sortedEmails);
  };

  return {
    emails,
    loading,
    error,
    totalPages,
    isAllChecked,
    handleSelectAll,
    handleCheckboxChange,
    handleSort,
    sortConfig,
  };
};

export default useProjectsSalesStaff;
