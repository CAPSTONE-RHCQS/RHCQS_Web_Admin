import requestWebRHCQS from '../../utils/axios';
import axios from 'axios';

export interface SubConstructionRequest {
  id: string;
  name: string;
  coefficient: number;
  unit: string;
}

export interface ConstructionRequest {
  name: string;
  coefficient: number;
  unit: string;
  type: string;
  subRequests: SubConstructionRequest[];
}

export interface ContractConstructionRequest {
  projectId: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string;
  note: string;
}

export interface ConstructionContractRequest {
  projectId: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string;
  note: string;
}

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

export const postConstructionContract = async (
  contractData: ConstructionContractRequest,
) => {
  try {
    const response = await requestWebRHCQS.post(
      '/contract/construction',
      contractData,
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error posting construction contract:', error);
    throw error;
  }
};
