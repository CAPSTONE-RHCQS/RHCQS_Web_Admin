import { useState, useEffect } from 'react';
import { getProjectsListSalesStaff } from '../api/Project/ProjectApi';
import axios from 'axios';

type Project = {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  category: string;
  date: string;
  status: string;
};

type SortConfig = {
  key: string;
  direction: 'ascending' | 'descending';
};

const useProjectsSalesStaff = (currentPage: number, refreshKey: number) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchProjects = async (page: number) => {
      setLoading(true);
      try {
        const data = await getProjectsListSalesStaff(page, 10);
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
          }));
          setProjects(formattedData);
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

    const sortedProjects = [...projects].sort((a, b) => {
      const aValue = a[key as keyof Project];
      const bValue = b[key as keyof Project];

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

    setProjects(sortedProjects);
  };

  return {
    projects,
    loading,
    error,
    totalPages,
    handleSort,
    sortConfig,
  };
};

export default useProjectsSalesStaff;
