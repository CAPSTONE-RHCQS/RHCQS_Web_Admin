import requestWebRHCQS from '../../utils/axios';

export async function getTotalProject() {
  try {
    const response = await requestWebRHCQS.get('/project/total-project', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total project:', error);
    throw new Error('Failed to fetch total project');
  }
}
