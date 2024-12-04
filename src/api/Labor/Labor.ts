import { LaborResponse, SearchLaborByNameResponse } from '../../types/Labor';
import { GetLaborByNameResponse } from '../../types/SearchContainNameTypes';
import requestWebRHCQS from '../../utils/axios';

export async function getLaborByName(
  name: string,
  packageId: string,
): Promise<GetLaborByNameResponse> {
  try {
    console.log('pk', packageId);
    const response = await requestWebRHCQS.get('/Labor/name', {
      params: { name, packageId },
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

export async function importExcelLabor(data: any) {
  try {
    const response = await requestWebRHCQS.post('/labor/import-excel', data, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error importing excel material:', error.response.data.Error);
    throw error.response.data.Error || 'Failed to import excel material';
  }
}

export async function searchLabor(
  name: string,
): Promise<SearchLaborByNameResponse> {
  try {
    const response = await requestWebRHCQS.get(`/labor/allname?name=${name}`, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching construction by name ${name}:`, error);
    throw new Error('Failed to fetch construction by name');
  }
}

export async function searchLaborByPackageId(
  name: string,
  packageId: string,
): Promise<SearchLaborByNameResponse> {
  try {
    const response = await requestWebRHCQS.get(
      `/labor/name?packageId=${packageId}&name=${name}`,
      {
        headers: {
          accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching construction by name ${name}:`, error);
    throw new Error('Failed to fetch construction by name');
  }
}