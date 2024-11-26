import {
  CreateContractDesignRequest,
  PaymentBatch,
} from '../../types/ContractTypes';
import requestWebRHCQS from '../../utils/axios';
import { ContractDesignResponse } from '../../types/ContractResponseTypes';

export const createContractDesign = async (
  data: CreateContractDesignRequest,
) => {
  try {
    console.log('Create Contract', data);
    const response = await requestWebRHCQS.post('/contract/design', data, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating contract design:', error);
    throw error;
  }
};

export const getContractDesignById = async (
  contractId: string,
): Promise<ContractDesignResponse> => {
  try {
    const response = await requestWebRHCQS.get(
      `/contract/design/id?contractId=${contractId}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contract design by ID:', error);
    throw error;
  }
};

export const signContractCompletion = async (
  contractId: string,
  file: File,
) => {
  try {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const response = await requestWebRHCQS.put(
      `/contract/construction/sign/completed?contractId=${contractId}`,
      formData,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing contract completion:', error);
    throw error;
  }
};

export const paymentContractDesign = async (paymentId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const response = await requestWebRHCQS.put(
      `/contract/design/confirm?paymentId=${paymentId}`,
      formData,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error signing contract completion:', error);
    throw error;
  }
};

export const paymentContractConstruction = async (
  paymentId: string,
  file: File,
) => {
  try {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const response = await requestWebRHCQS.put(
      `/contract/construction/confirm?paymentId=${paymentId}`,
      formData,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error signing contract completion:', error);
    throw error;
  }
};
