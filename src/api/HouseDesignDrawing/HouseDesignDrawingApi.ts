import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';
import { HouseDesignDetailResponse } from '../../types/HouseDesignTypes';

export const createHouseDesign = async (data: {
  projectId: string;
  designerPerspective: string;
  designerArchitecture: string;
  designerStructure: string;
  designerElectricityWater: string;
}): Promise<AxiosResponse> => {
  try {
    console.log('data', data);
    const response = await requestWebRHCQS.post('/housedesign', data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating house design:', error);
    throw error;
  }
};

export const getHouseDesigns = async (
  page: number = 1,
  size: number = 10,
): Promise<AxiosResponse> => {
  try {
    const response = await requestWebRHCQS.get('/housedesign/design', {
      params: {
        page,
        size,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching house designs:', error);
    throw error;
  }
};

export const getHouseDesignById = async (
  id: string,
): Promise<AxiosResponse<HouseDesignDetailResponse>> => {
  try {
    const response = await requestWebRHCQS.get<HouseDesignDetailResponse>(
      `/housedesign/id`,
      {
        params: {
          id,
        },
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error fetching house design by id:', error);
    throw error;
  }
};

export async function getHouseDesignDrawingStatus(
  houseDesignId: string,
): Promise<string> {
  try {
    const response = await requestWebRHCQS.get(`/housedesign/status/id`, {
      params: { houseDesignId },
      headers: {
        accept: 'text/plain',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching status for initial ID ${houseDesignId}:`,
      error,
    );
    throw new Error('Failed to fetch initial quotation status');
  }
}
