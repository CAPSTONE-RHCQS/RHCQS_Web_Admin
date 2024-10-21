import requestWebDriver from '../../utils/axios';

export const getFinalQuotation = async (id: string) => {
  try {
    const response = await requestWebDriver.get(`/quotation/final/id`, {
      params: { id },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching final quotation:', error);
    throw error;
  }
};
