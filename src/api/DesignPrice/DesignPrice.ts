import requestWebRHCQS from '../../utils/axios';
import { DesignPrice, DesignPriceRequest } from '../../types/DesignPrice';

export async function getDesignPrice(): Promise<DesignPrice> {
  try {
    const response = await requestWebRHCQS.get('/alldesignprices', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching design price:', error);
    throw new Error('Failed to fetch design price');
  }
}

export async function createDesignPrice(designPrice: DesignPriceRequest) {
  try {
    const response = await requestWebRHCQS.post('/designprice', designPrice);
    return response.data;
  } catch (error) {
    console.error('Error creating design price:', error);
    throw new Error('Failed to create design price');
  }
}

export async function updateDesignPrice(
  designPrice: DesignPriceRequest,
  id: string,
) {
  try {
    const response = await requestWebRHCQS.put(
      `/designprice?id=${id}`,
      designPrice,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating design price:', error);
    throw new Error('Failed to update design price');
  }
}
