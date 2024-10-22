import requestWebRHCQS from '../../utils/axios';

export const getProjects = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get('/project', {
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

export const getProjectDetail = async (id: string) => {
  try {
    const response = await requestWebRHCQS.get(`/project/id`, {
      params: {
        id,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project detail:', error);
    throw error;
  }
};

export const getProjectsStaff = async (page: number, size: number) => {
  try {
    const response = await requestWebRHCQS.get('/project/sales', {
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

// export const postSalesProject = async (page: number, size: number) => {
//   try {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       throw new Error('Token not found in localStorage');
//     }

//     const response = await requestWebRHCQS.post(
//       '/project/sales',
//       {
//         token: token,
//       },
//       {
//         params: {
//           page,
//           size,
//         },
//         headers: {
//           accept: 'text/plain',
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error posting sales project:', error);
//     throw error;
//   }
// };

export const assignProject = async (accountId: string, projectId: string) => {
  try {
    const response = await requestWebRHCQS.put(
      '/project/assign',
      {
        accountId,
        projectId,
      },
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning project:', error);
    throw error;
  }
};
