import { AxiosResponse } from 'axios';
import requestWebRHCQS from '../../utils/axios';

export const uploadFile = async (
  file: File,
  fileName: string,
): Promise<AxiosResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await requestWebRHCQS.post(`/drawing/version`, formData, {
      params: {
        fileName: encodeURIComponent(fileName),
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: '*/*',
      },
    });

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
