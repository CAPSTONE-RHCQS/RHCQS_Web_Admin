import {
  CreateContractDesignRequest,
  PaymentBatch,
} from '../../types/ContractTypes';
import requestWebRHCQS from '../../utils/axios';
import { ContractDesignResponse } from '../../types/ContractResponseTypes';
import { ConstructionContractRequest } from '../../types/ConstructionTypes';

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

export const createConstructionContract = async (
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

export const paymentContractAppendix = async (
  paymentId: string,
  file: File,
) => {
  try {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const response = await requestWebRHCQS.put(
      `/contract/appendix/confirm/bill?paymentId=${paymentId}`,
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

export const approveContractBill = async (paymentId: string, type: string) => {
  try {
    const response = await requestWebRHCQS.put(
      `/contract/approve/bill?paymentId=${paymentId}&type=${type}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error approving contract bill:', error);
    throw error;
  }
};

export const createContractAppendix = async (data: {
  contractId: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string;
  note: string;
  cancelBatchPaymnetContract: { batchPaymentId: string }[];
  batchPaymentRequests: {
    numberOfBatches: number;
    price: number;
    paymentDate: string;
    paymentPhase: string;
    percents: number;
    description: string;
  }[];
}) => {
  try {
    const response = await requestWebRHCQS.post('/contract/appendix', data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating contract appendix:', error);
    throw error;
  }
};
