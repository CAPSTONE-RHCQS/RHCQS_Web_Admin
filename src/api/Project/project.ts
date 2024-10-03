import requestWebDriver from '../../utils/axios';

export const getProjects = async (page: number, size: number) => {
  try {
    const response = await requestWebDriver.get('/project', {
      params: {
        page,
        size,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};
