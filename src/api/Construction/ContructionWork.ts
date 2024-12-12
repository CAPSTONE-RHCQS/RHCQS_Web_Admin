import { ConstructionWorkType, CreateConstructionWork, UpdateConstructionWork } from '../../types/ContructionWork';
import {
  SearchConstructionWorkItem,
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
    return response.data as SearchConstructionWorkItem[];
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const multipleSearchConstructionWorkItem = async (
  page: number,
  size: number,
  code: string,
  name: string,
  unit: string,
): Promise<ConstructionWorkType> => {
  try {
    const response = await requestWebRHCQS.get(
      `/construction-work/multi-filter?page=${page}&size=${size}&code=${code}&name=${name}&unit=${unit}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data as ConstructionWorkType;
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

export const updateConstructionWork = async (id: string, data: UpdateConstructionWork) => {
  try {
    const response = await requestWebRHCQS.put(
      `/construction-work/id?constructionWorkId=${id}`,
      data,
      {
        headers: {
          accept: 'text/plain',
        },
      });
    return response.data;
  } catch (error: any) {
    console.error(
      'Error updating construction work:',
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
