import requestWebRHCQS from '../../utils/axios';

interface ProjectItem {
  Id: string;
  AccountName: string;
  Name: string;
  Type: string;
  Status: string;
  InsDate: string;
  UpsDate: string;
  ProjectCode: string;
}

interface ProjectListResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: ProjectItem[];
}

export const getProjectsList = async (
  page: number,
  size: number,
): Promise<ProjectListResponse> => {
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

export const getProjectsListWithType = async (
  page: number,
  size: number,
  type: string,
): Promise<ProjectListResponse> => {
  try {
    const response = await requestWebRHCQS.get('/project/filter', {
      params: {
        page,
        size,
        type,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects with type:', error);
    throw error;
  }
};

export const getProjectsListByName = async (
  name: string,
  page: number,
  size: number,
): Promise<ProjectListResponse> => {
  try {
    const response = await requestWebRHCQS.get('/project/contain/name', {
      params: {
        name,
        page,
        size,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects by name:', error);
    throw error;
  }
};

export const getProjectsListSalesStaff = async (
  page: number,
  size: number,
): Promise<ProjectListResponse> => {
  try {
    const response = await requestWebRHCQS.get<ProjectListResponse>(
      '/project/sales',
      {
        params: {
          page,
          size,
        },
        headers: {
          accept: 'text/plain',
        },
      },
    );
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

export const cancelProject = async (projectId: string) => {
  try {
    const response = await requestWebRHCQS.put(`/project/cancel`, null, {
      params: { projectId },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error cancelling project:', error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error('Error cancelling project:', error);
      throw error;
    }
  }
};

export const getProjectsByMultiFilter = async (
  page: number,
  size: number,
  startTime: string,
  status: string,
  type: string,
  code: string,
  phone: string
): Promise<ProjectListResponse> => {
  try {
    const response = await requestWebRHCQS.get('/project/multi-filter', {
      params: {
        page,
        size,
        startTime,
        status,
        type,
        code,
        phone,
      },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects by multi-filter:', error);
    throw error;
  }
};
