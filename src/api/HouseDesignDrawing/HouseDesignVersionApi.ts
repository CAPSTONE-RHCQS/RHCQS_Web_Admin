import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';
import { CreateDesignRequest } from '../../types/HouseDesignVersionTypes';
import { toast } from 'react-toastify';

interface ApproveDesignParams {
  id: string;
  type: string;
  reason: string;
}

export const createDesign = async (
  data: CreateDesignRequest,
): Promise<AxiosResponse> => {
  try {
    const response = await requestWebRHCQS.post('/design', data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating design:', error);
    throw error;
  }
};

export async function approveDesign(
  id: string,
  data: { type: string; reason: string },
): Promise<void> {
  try {
    console.log('data:', data);
    const response = await requestWebRHCQS.put(`/design/approve`, data, {
      params: { id },
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error(`Error approving house design for ID ${id}:`, error);
    if (error.response && error.response.data && error.response.data.Error) {
      toast.error(` ${error.response.data.Error}`);
    } else {
      toast.error('Đã xảy ra lỗi không xác định');
    }
    throw new Error('Failed to approve house design');
  }
}
