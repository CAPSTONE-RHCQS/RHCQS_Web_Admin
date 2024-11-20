import { EquipmentResponse } from '../../types/EquipmentTypes';
import requestWebRHCQS from '../../utils/axios';

export const uploadEquipmentExcel = async (
  file: File,
): Promise<EquipmentResponse> => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  try {
    const response = await requestWebRHCQS.post<EquipmentResponse>(
      '/equiqment/excel',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading equipment Excel:', error);
    throw error;
  }
};
