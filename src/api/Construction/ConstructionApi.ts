import { GetConstructionByNameResponse } from '../../types/SearchContainNameTypes';
import requestWebRHCQS from '../../utils/axios';
import { FinalToContractResponse } from '../../types/ContractResponseTypes';
import {
  ConstructionRequest,
  ConstructionWork,
} from '../../types/ConstructionTypes';
import { ConstructionTypeResponse } from '../../types/ConstructionTypeResponse';

export const getConstructions = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/construction`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching constructions:', error);
    throw error;
  }
};

export const postConstruction = async (
  constructionData: ConstructionRequest,
) => {
  try {
    const dataWithQuotation = {
      ...constructionData,
      isFinalQuotation: false,
    };

    const response = await requestWebRHCQS.post(
      '/construction',
      dataWithQuotation,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting construction:', error);
    throw error;
  }
};

export const putConstruction = async (
  id: string,
  constructionData: ConstructionRequest,
) => {
  try {
    const response = await requestWebRHCQS.put(
      `/construction?id=${id}`,
      constructionData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating construction:', error);
    throw error;
  }
};

export async function getConstructionByName(
  name: string,
): Promise<GetConstructionByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/construction/contain/name', {
      params: { name },
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

export const searchConstructionWork = async (
  packageId: string,
  constructionItemId: string,
  name: string,
): Promise<ConstructionWork[]> => {
  try {
    const response = await requestWebRHCQS.get<ConstructionWork[]>(
      `/construction/construction-work/search`,
      {
        params: { packageId, constructionItemId, name },
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching construction work:', error);
    throw error;
  }
};

export const getFinalToContractConstruction = async (
  projectId: string,
): Promise<FinalToContractResponse> => {
  try {
    const response = await requestWebRHCQS.get(
      `/contract/final-to-contract/construction`,
      {
        params: { projectId },
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching final to contract construction:', error);
    throw error;
  }
};

export const getConstructionByType = async (
  type: string,
): Promise<ConstructionTypeResponse[]> => {
  try {
    const response = await requestWebRHCQS.get<ConstructionTypeResponse[]>(
      `/construction/type`,
      {
        params: { type },
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching construction by type ${type}:`, error);
    throw error;
  }
};
