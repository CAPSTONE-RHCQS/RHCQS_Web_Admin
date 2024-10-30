import requestWebRHCQS from '../../utils/axios';
import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
} from '../../types/InitialQuotationTypes';
import { toast } from 'react-toastify';

export async function getInitialQuotation(
  id: string,
): Promise<InitialQuotationResponse> {
  try {
    const response = await requestWebRHCQS.get(`/quotation/initial/id`, {
      params: { id },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching initial quotation for ID ${id}:`, error);
    throw new Error('Failed to fetch initial quotation');
  }
}

export async function updateInitialQuotation(
  data: UpdateInitialQuotationRequest,
): Promise<void> {
  try {
    console.log('Updating initial', data);
    const response = await requestWebRHCQS.post(
      '/quotation/initial/update',
      data,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Update successful:', response.data);
  } catch (error) {
    console.error('Error updating initial quotation:', error);
    throw new Error('Failed to update initial quotation');
  }
}

export async function createNewInitialQuotation(
  projecId: string,
): Promise<InitialQuotationResponse> {
  try {
    const response = await requestWebRHCQS.get(`/quotation/initial/new`, {
      params: { projecId },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error creating new initial quotation for project ID ${projecId}:`,
      error,
    );
    throw new Error('Failed to create new initial quotation');
  }
}

export async function approveInitialQuotation(
  initialId: string,
  data: { type: string; reason: string },
): Promise<void> {
  try {
    const response = await requestWebRHCQS.put(
      `/quotation/initial/approve`,
      data,
      {
        params: { initialId },
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: any) {
    console.error(
      `Error approving initial quotation for ID ${initialId}:`,
      error,
    );
    if (error.response && error.response.data) {
      toast.error(` ${error.response.data}`);
    } else {
      toast.error('Đã xảy ra lỗi không xác định');
    }
    throw new Error('Failed to approve initial quotation');
  }
}
