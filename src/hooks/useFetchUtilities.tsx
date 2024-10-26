import { useState, useEffect } from 'react';
import { getUtilities } from '../api/Utility/UtilityApi';

const useFetchUtilities = (currentPage: number, refreshKey: number) => {
  const [utilities, setUtilities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUtilities, setTotalUtilities] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUtilities = async () => {
      setIsLoading(true);
      try {
        const data = await getUtilities(currentPage, 10);
        setUtilities(data.Items);
        setTotalPages(data.TotalPages);
        setTotalUtilities(data.Total);
      } catch (error) {
        console.error('Failed to fetch utilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilities();
  }, [currentPage, refreshKey]);

  return {
    totalPages,
    totalUtilities,
    isLoading,
    utilities,
    setUtilities,
  };
};

export default useFetchUtilities;
