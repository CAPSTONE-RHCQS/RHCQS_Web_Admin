import { CreateConstructionWork } from '../../types/ContructionWork';
import {
  SearchConstructionWorkItem,
  SearchConstructionWorkResponse,
} from '../../types/ContructionWork';
import requestWebRHCQS from '../../utils/axios';

export const getConstructionWorks = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/construction-work`, {
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

export const getConstructionWorkById = async (id: string) => {
  try {
    const response = await requestWebRHCQS.get(
      `/construction-work/id?workId=${id}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching constructions:', error);
    throw error;
  }
};

export const getPackageConstructionWork = async (id: string) => {
  try {
    const response = await requestWebRHCQS.get(
      `/construction-work/workid?workId=${id}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching constructions:', error);
    throw error;
  }
};

export const searchConstructionWorkItem = async (
  name: string,
): Promise<SearchConstructionWorkItem[]> => {
  try {
    const response = await requestWebRHCQS.get(
      `/construction/item-work/search?name=${name}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    console.log(response.data);
    return response.data as SearchConstructionWorkItem[];
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const createConstructionWork = async (data: CreateConstructionWork) => {
  try {
    const response = await requestWebRHCQS.post('/construction-work', data, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Error creating construction work:',
      error.response.data.Error,
    );
    throw error;
  }
};

export const importConstructionWorkByExcel = async (data: any) => {
  try {
    const response = await requestWebRHCQS.post(
      '/construction-work/import-file',
      data,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Error updating construction work:',
      error.response.data.Error,
    );
    throw error;
  }
};

export const createPackageConstructionWork = async (data: any) => {
  try {
    const response = await requestWebRHCQS.post('/work-template', data, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      'Error creating package construction work:',
      error.response.data.Error,
    );
    throw error;
  }
};
