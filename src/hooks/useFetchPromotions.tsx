import { useState, useEffect } from 'react';
import { getPromotions } from '../api/Promotion/PromotionApi';

const useFetchPromotions = (currentPage: number, refreshKey: number) => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      try {
        const data = await getPromotions(currentPage, 10);
        setPromotions(data.Items);
        setTotalPages(data.TotalPages);
        setTotalPromotions(data.Total);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [currentPage, refreshKey]);

  return {
    totalPages,
    totalPromotions,
    isLoading,
    promotions,
    setPromotions,
  };
};

export default useFetchPromotions;
