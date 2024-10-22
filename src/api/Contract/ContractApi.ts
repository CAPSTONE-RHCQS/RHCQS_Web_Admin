import requestWebRHCQS from '../../utils/axios';

export const createContractDesign = async (data: any) => {
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
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contract design by ID:', error);
    throw error;
  }
};
