import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';
import {
  HouseTemplateDetail,
  HouseTemplateResponse,
} from '../../types/HouseTemplateTypes';

export const fetchHouseTemplates = async (
  page: number,
  size: number,
): Promise<HouseTemplateResponse> => {
  try {
    const response: AxiosResponse<HouseTemplateResponse> =
      await requestWebRHCQS.get('/housetemplate', {
        params: {
          page,
          size,
        },
        headers: {
          accept: 'text/plain',
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching house templates:', error);
    throw error;
  }
};

export const fetchHouseTemplateDetail = async (
  id: string,
): Promise<HouseTemplateDetail> => {
  try {
    const response: AxiosResponse<HouseTemplateDetail> =
      await requestWebRHCQS.get(`/housetemplate/id`, {
        params: { id },
        headers: {
          accept: 'text/plain',
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching house template detail:', error);
    throw error;
  }
};
