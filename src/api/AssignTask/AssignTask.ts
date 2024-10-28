import requestWebRHCQS from '../../utils/axios';

export const getAvailableDesignStaff = async (): Promise<any> => {
  try {
    const response = await requestWebRHCQS.get('/task/design-staff/available', {
      headers: {
        accept: 'text/plain',
      },
    });
    console.log('res', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching available design staff:', error);
    throw error;
  }
};
