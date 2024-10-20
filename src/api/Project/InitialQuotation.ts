import requestWebDriver from '../../utils/axios';
import { InitialQuotationResponse } from '../../types/InitialQuotationTypes';

export async function getInitialQuotation(id: string): Promise<InitialQuotationResponse> {
  try {
    const response = await requestWebDriver.get(`/quotation/initial/id`, {
      params: { id },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching initial quotation for ID ${id}:`, error);
    throw new Error('Failed to fetch initial quotation');
  }
}
