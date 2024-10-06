import { useState, useEffect } from 'react';
import { getConstructions } from '../api/Construction/Construction';

const useFetchConstructions = (currentPage: number, refreshKey: number) => {
  const [constructions, setConstructions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConstructions, setTotalConstructions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConstructions = async () => {
      setIsLoading(true);
      try {
        const data = await getConstructions(currentPage, 10);
        setConstructions(data.Items);
        setTotalPages(data.TotalPages);
        setTotalConstructions(data.Total);
      } catch (error) {
        console.error('Failed to fetch constructions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConstructions();
  }, [currentPage, refreshKey]);

  return {
    totalPages,
    totalConstructions,
    isLoading,
    constructions,
    setConstructions,
  };
};

export default useFetchConstructions;
