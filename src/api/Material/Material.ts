import { MaterialListResponse, MaterialSectionListResponse } from '../../types/Material';
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

export async function getMaterialSectionList(
  page: number,
  size: number
): Promise<MaterialSectionListResponse> {
  try {
    const response = await requestWebRHCQS.get('/materialsection', {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material section list:', error);
    throw new Error('Failed to fetch material section list');
  }
}

export async function getMaterialList(
  page: number,
  size: number
): Promise<MaterialListResponse> {
  try {
    const response = await requestWebRHCQS.get('/material', {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material list:', error);
    throw new Error('Failed to fetch material list');
  }
}
