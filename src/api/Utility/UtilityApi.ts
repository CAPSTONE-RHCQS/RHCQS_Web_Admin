import { GetUtilityByNameResponse } from '../../types/SearchContainNameTypes';
import {
  SectionItem,
  UtilityRequest,
  UtilityUpdateRequest,
} from '../../types/UtilityTypes';
import requestWebRHCQS from '../../utils/axios';

export const getUtilities = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/utilities`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching utilities:', error);
    throw error;
  }
};

export const getUtilityById = async (id: string) => {
  try {
    const response = await requestWebRHCQS.get(`/utilities/id?id=${id}`, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching utility by id:', error);
    throw error;
  }
};

export const postUtility = async (utilityData: UtilityRequest) => {
  try {
    const response = await requestWebRHCQS.post('/utilities', utilityData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error posting utility:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error posting utility:', error);
      throw error;
    }
  }
};

export const putUtility = async (utilityData: UtilityUpdateRequest) => {
  try {
    const response = await requestWebRHCQS.put(`/utilities`, utilityData, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error updating utility:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error updating utility:', error);
      throw error;
    }
  }
};

export async function getSectionById(id: string): Promise<SectionItem> {
  try {
    const response = await requestWebRHCQS.get(
      `/utilities/section/id?id=${id}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching utilities by id ${id}:`, error);
    throw new Error('Failed to fetch utilities by id');
  }
}

export async function getUtilityByName(
  name: string,
  projectType: string,
): Promise<GetUtilityByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/utilities/contain/name', {
      params: { name, projectType },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching utilities by name ${name}:`, error);
    throw new Error('Failed to fetch utilities by name');
  }
}
