import requestWebDriver from '../../utils/axios';
import axios from 'axios';

interface SubConstructionRequest {
  name: string;
  coefficient: number;
  unit: string;
}

export interface ConstructionRequest {
  name: string;
  coefficient: number;
  unit: string;
  type: string;
  subConstructionRequests: SubConstructionRequest[];
}

export const getConstructions = async (page: number, size: number) => {
  try {
    const response = await requestWebDriver.get(`/construction`, {
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
    const response = await requestWebDriver.post(
      '/construction',
      constructionData,
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
