import { useState, useEffect } from 'react';
import { InitialQuotationResponse } from '../types/InitialQuotationTypes';
import { getInitialQuotation } from '../api/InitialQuotation/InitialQuotationApi';

export const useQuotationData = (id: string) => {
  const [quotationData, setQuotationData] = useState<InitialQuotationResponse | null>(null);

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (id) {
        try {
          const data: InitialQuotationResponse = await getInitialQuotation(id);
          setQuotationData(data);
        } catch (error) {
          console.error('Error fetching quotation data:', error);
        }
      }
    };

    fetchQuotationData();
  }, [id]);

  return quotationData;
}; 