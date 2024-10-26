import { UtilityRequest } from '../../types/UtilityTypes';
import requestWebRHCQS from '../../utils/axios';

export const getUtilities = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get(`/utilities`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching utilities:', error);
    throw error;
  }
};

export const postUtility = async (utilityData: UtilityRequest) => {
  try {
    console.log('postUtility', utilityData);

    const response = await requestWebRHCQS.post('/utilities', utilityData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error posting utility:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error posting utility:', error);
      throw error;
    }
  }
};

export const putUtility = async (id: string, utilityData: UtilityRequest) => {
  try {
    const formattedData = {
      utility: {
        id: id,
        name: utilityData.name,
      },
      sections: utilityData.sections.map((section) => ({
        id: section.id,
        name: section.name,
        description: section.description,
        unitPrice: section.unitPrice,
        unit: section.unit,
      })),
      items: utilityData.items.map((item) => ({
        name: item.name,
        coefficient: item.coefficient,
      })),
    };
    console.log('putUtility', formattedData );

    const response = await requestWebRHCQS.put('/utilities', formattedData, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error updating utility:', error.response.data.Error);
      throw new Error(error.response.data.Error);
    } else {
      console.error('Error updating utility:', error);
      throw error;
    }
  }
};
