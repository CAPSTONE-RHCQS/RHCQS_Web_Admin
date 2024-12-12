import { PromotionRequest } from '../../types/PromotionTypes';
import requestWebRHCQS from '../../utils/axios';
import {
  GetPromotionByNameResponse,
  Promotion,
} from '../../types/SearchContainNameTypes';

export const getPromotions = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/promotion`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const postPromotion = async (promotionData: PromotionRequest) => {
  try {
    const dataWithQuotation = {
      ...promotionData,
      isFinalQuotation: false,
    };

    const response = await requestWebRHCQS.post(
      '/promotion',
      dataWithQuotation,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error posting promotion:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error posting promotion:', error);
      throw error;
    }
  }
};

export const putPromotion = async (
  id: string,
  promotionData: PromotionRequest,
) => {
  try {
    const response = await requestWebRHCQS.put(
      `/promotion/id?promotionId=${id}`,
      promotionData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error updating promotion:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error updating promotion:', error);
      throw error;
    }
  }
};

export const getPromotionByName = async (
  name: string,
  packageId: string,
): Promise<Promotion[]> => {
  try {
    const response = await requestWebRHCQS.get(`/promotion/name`, {
      params: { name, packageId },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion by name:', error);
    throw error;
  }
};
