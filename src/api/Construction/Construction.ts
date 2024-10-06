import requestWebDriver from "../../utils/axios";

export const getConstructions = async (page: number, size: number) => {
  try {
    const response = await requestWebDriver.get(`/construction`, {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching constructions:', error);
    throw error;
  }
};

