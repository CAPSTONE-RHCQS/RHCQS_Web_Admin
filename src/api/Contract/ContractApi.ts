import { CreateContractDesignRequest, PaymentBatch } from '../../types/ContractTypes';
import requestWebRHCQS from '../../utils/axios';

export const createContractDesign = async (
  data: CreateContractDesignRequest,
) => {
  try {
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

export const getContractDesignById = async (contractId: string) => {
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
      `/contract/design/confirm/completed?paymentId=${paymentId}`,
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
      `/contract/construction/sign/completed?paymentId=${paymentId}`,
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

export const getPaymentBatchesByProjectId = async (projectId: string): Promise<PaymentBatch[]> => {
  try {
    const response = await requestWebRHCQS.get(`/payment/batch/id?projectId=${projectId}`, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment batches by project ID:', error);
    throw error;
  }
};

