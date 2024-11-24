import { LaborResponse } from '../../types/Labor';
import { GetLaborByNameResponse } from '../../types/SearchContainNameTypes';
import requestWebRHCQS from '../../utils/axios';

export async function getLaborByName(
  name: string,
): Promise<GetLaborByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/Labor/name', {
      params: { name },
      headers: {
        accept: 'text/plain',
      },
    });
    console.log('Labor search results:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching labor by name ${name}:`, error);
    throw new Error('Failed to fetch labor by name');
  }
}

export async function getLabor(
  page: number,
  size: number,
): Promise<LaborResponse> {
  try {
    const response = await requestWebRHCQS.get('/labor', {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching labor:', error);
    throw new Error('Failed to fetch labor');
  }
}

export async function createLabor(data: any): Promise<any> {
  try {
    const response = await requestWebRHCQS.post('/labor', data);
    return response.data;
  } catch (error) {
    console.error('Error creating labor:', error);
    throw new Error('Failed to create labor');
  }
}

export async function updateLabor(id: string, data: any): Promise<any> {
  try {
    const response = await requestWebRHCQS.put(`/labor?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating labor:', error);
    throw new Error('Failed to update labor');
  }
}
