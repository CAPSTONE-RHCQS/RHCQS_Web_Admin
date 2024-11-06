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

export async function approveFinalQuotation(
  finalId: string,
  data: { type: string; reason: string },
): Promise<void> {
  try {
    const response = await requestWebRHCQS.put(
      `/quotation/final/approve`,
      data,
      {
        params: { finalId },
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Approval successful:', response.data);
  } catch (error) {
    console.error('Error approving final quotation:', error);
    throw new Error('Failed to approve final quotation');
  }
}

export const postFinalQuotationByProjectId = async (
  projectId: string,
): Promise<void> => {
  try {
    const response = await requestWebRHCQS.post(
      `/quotation/final/projectid`,
      null,
      {
        params: { projectid: projectId },
        headers: {
          accept: 'text/plain',
        },
      },
    );
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error posting final quotation by project ID:', error);
    throw error;
  }
};
