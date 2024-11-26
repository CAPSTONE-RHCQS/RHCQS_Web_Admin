import requestWebRHCQS from '../../utils/axios';

export const getAvailableDesignStaff = async (
  page: number,
  size: number,
): Promise<any> => {
  try {
    const response = await requestWebRHCQS.get('/task/design-staff/available', {
      headers: {
        accept: 'text/plain',
      },
      params: {
        page,
        size,
      },
    });
    return response.data.Items;
  } catch (error) {
    console.error('Error fetching available design staff:', error);
    throw error;
  }
};
