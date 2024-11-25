import { MaterialItem, MaterialListResponse, MaterialSectionItem, MaterialSectionListResponse } from '../../types/Material';
import { GetMaterialByNameResponse } from '../../types/SearchContainNameTypes';
import requestWebRHCQS from '../../utils/axios';

export async function getMaterialByName(
  name: string,
  packageId: string,
): Promise<GetMaterialByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/Material/name', {
      params: { name, packageId },
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

export async function getMaterialById(id: string) {
  try {
    const response = await requestWebRHCQS.get(`/material/id?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching material by id:', error);
    throw new Error('Failed to fetch material by id');
  }
}

export async function createMaterialSection(data: any) {
  try {
    const response = await requestWebRHCQS.post('/materialsection', data, );
    return response.data;
  } catch (error) {
    console.error('Error creating material section:', error);
    throw new Error('Failed to create material section');
  }
}

export async function updateMaterialSection(id: string, data: any) {
  try {
    const response = await requestWebRHCQS.put(
      `/materialsection?id=${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating material section ${id}:`, error);
    throw new Error('Failed to update material section');
  }
}

export async function getMaterialSectionById(id: string): Promise<MaterialSectionItem> {
  try {
    const response = await requestWebRHCQS.get(`/materialsection/id?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching material section by id:', error);
    throw new Error('Failed to fetch material section by id');
  }
}

export async function searchMaterialSection(name: string) {
  try {
    const response = await requestWebRHCQS.get(`/materialsection/name?name=${name}`);
    return response.data;
  } catch (error) {
    console.error('Error searching material section:', error);
    throw new Error('Failed to search material section');
  }
}

export async function createMaterial(data: any) {
  try {
    const response = await requestWebRHCQS.post('/material', data, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw new Error('Failed to create material');
  }
}

export async function updateMaterial(id: string, data: any) {
  try {
    const response = await requestWebRHCQS.put(
      `/material?id=${id}`,
      data,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw new Error('Failed to update material');
  }
}

