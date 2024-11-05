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
    return response.data;
  } catch (error) {
    console.error(`Error fetching labor by name ${name}:`, error);
    throw new Error('Failed to fetch labor by name');
  }
}
