import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';
import { CreateDesignRequest } from '../../types/HouseDesignVersionTypes';

export const createDesign = async (
  data: CreateDesignRequest,
): Promise<AxiosResponse> => {
  try {
    console.log('dataaaa', data);
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
