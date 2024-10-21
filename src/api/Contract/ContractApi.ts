import requestWebDriver from '../../utils/axios';

export const createContractDesign = async (data: any) => {
  try {
    const response = await requestWebDriver.post('/contract/design', data, {
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
