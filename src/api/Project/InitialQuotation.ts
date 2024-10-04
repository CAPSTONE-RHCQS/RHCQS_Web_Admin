import requestWebDriver from '../../utils/axios';

export async function getInitialQuotation(id: string) {
  try {
    const response = await requestWebDriver.get(`/quotation/initial/id`, {
      params: { id },
      headers: {
        accept: 'text/plain',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching initial quotation:', error);
    throw error;
  }
}
