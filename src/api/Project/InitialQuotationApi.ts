import requestWebDriver from '../../utils/axios';
import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
} from '../../types/InitialQuotationTypes';

export async function getInitialQuotation(
  id: string,
): Promise<InitialQuotationResponse> {
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

export async function updateInitialQuotation(
  data: UpdateInitialQuotationRequest,
): Promise<void> {
  try {
    console.log('Updating initial', data);
    const response = await requestWebDriver.post(
      '/quotation/initial/update',
      data,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Update successful:', response.data);
  } catch (error) {
    console.error('Error updating initial quotation:', error);
    throw new Error('Failed to update initial quotation');
  }
}
