import { GetMaterialByNameResponse } from '../../types/SearchContainNameTypes';
import requestWebRHCQS from '../../utils/axios';

export async function getMaterialByName(
  name: string,
): Promise<GetMaterialByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/Material/name', {
      params: { name },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching material by name ${name}:`, error);
    throw new Error('Failed to fetch material by name');
  }
}
