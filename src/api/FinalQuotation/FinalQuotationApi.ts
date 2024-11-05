import requestWebRHCQS from '../../utils/axios';
import { FinalQuotationResponse } from '../../types/FinalQuotationTypes';
import axios from 'axios';
import { FinalQuotationRequest } from '../../types/FinalQuotationRequestTypes';

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

export const updateFinalQuotation = async (data: FinalQuotationRequest) => {
  try {
    console.log('Updating final quotation', data);
    const response = await requestWebRHCQS.put('/quotation/final', data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating final quotation:', error);
    throw error;
  }
};
