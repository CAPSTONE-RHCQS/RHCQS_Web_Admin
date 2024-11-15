import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';
import {
  HouseTemplateDetail,
  HouseTemplateResponse,
  UpdateSubTemplateHouseRequest,
} from '../../types/HouseTemplateTypes';
import { CreateHouseTemplateRequest } from '../../types/HouseTemplateTypes';

export const fetchHouseTemplates = async (
  page: number,
  size: number,
): Promise<HouseTemplateResponse> => {
  try {
    const response: AxiosResponse<HouseTemplateResponse> =
      await requestWebRHCQS.get('/house-templates-list', {
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

export const createHouseTemplate = async (
  request: CreateHouseTemplateRequest,
): Promise<HouseTemplateDetail> => {
  try {
    const response: AxiosResponse<HouseTemplateDetail> =
      await requestWebRHCQS.post('/housetemplate', request, {
        headers: {
          accept: 'text/plain',
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error creating house template:', error);
    throw error;
  }
};

export const addImageHouseTemplate = async (
  designTemplateId: string,
  request: FormData,
): Promise<HouseTemplateDetail> => {
  try {
    const response: AxiosResponse<HouseTemplateDetail> = await requestWebRHCQS.post(
      `/upload-design-images?designTemplateId=${designTemplateId}`,
      request,
      {
        headers: {
          accept: 'text/plain',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding image house template:', error);
    throw error;
  }
};

export const uploadSubHouseTemplate = async (
  subTempateId: string,
  request: FormData,
): Promise<HouseTemplateDetail> => {
  try {
    const response: AxiosResponse<HouseTemplateDetail> = await requestWebRHCQS.patch(
      `/upload-sub-template?subTempateId=${subTempateId}`,
      request,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading sub house template:', error);
    throw error;
  }
};

export const updateSubTemplateHouse = async (
  subTemplateId: string,
  data: UpdateSubTemplateHouseRequest,
): Promise<HouseTemplateDetail> => {
  try {
    const response: AxiosResponse<HouseTemplateDetail> = await requestWebRHCQS.put(
      `/sub-template/id?subTemplateId=${subTemplateId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating sub template house:', error);
    throw error;
  }
};
