import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';

export const createHouseDesign = async (data: {
  projectId: string;
  designerPerspective: string;
  designerArchitecture: string;
  designerStructure: string;
  designerElectricityWater: string;
}): Promise<AxiosResponse> => {
  try {
    console.log('data', data);
    const response = await requestWebRHCQS.post('/housedesign', data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'text/plain',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating house design:', error);
    throw error;
  }
};
