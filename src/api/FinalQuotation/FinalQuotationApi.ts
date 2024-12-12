import requestWebRHCQS from '../../utils/axios';
import { FinalQuotationResponse } from '../../types/FinalQuotationTypes';
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
  } catch (error) {
    console.error('Error approving final quotation:', error);
    throw new Error('Failed to approve final quotation');
  }
}

export const postFinalQuotationByProjectId = async (
  projectId: string,
): Promise<FinalQuotationResponse> => {
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
    return response.data;
  } catch (error) {
    console.error('Error posting final quotation by project ID:', error);
    throw error;
  }
};

export async function getFinalQuotationStatus(
  finalId: string,
): Promise<string> {
  try {
    const response = await requestWebRHCQS.get(`/quotation/final/status/id`, {
      params: { finalId },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for final ID ${finalId}:`, error);
    throw new Error('Failed to fetch final quotation status');
  }
}
