import requestWebRHCQS from '../../utils/axios';
import { FinalQuotationResponse } from '../../types/FinalQuotationTypes';

export const getFinalQuotation = async (
  id: string,
): Promise<FinalQuotationResponse> => {
  try {
    const response = await requestWebRHCQS.get(`/quotation/final/id`, {
      params: { id },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching final quotation:', error);
    throw error;
  }
};
