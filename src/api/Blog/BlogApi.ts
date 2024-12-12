import requestWebRHCQS from '../../utils/axios';
import { BlogResponse } from '../../types/BlogTypes';

interface CreateBlogRequest {
  heading: string;
  subHeading: string;
  context: string;
  imgUrl: string;
}

interface UpdateBlogRequest {
  id: string;
  heading: string;
  subHeading: string;
  context: string;
  imgUrl: string;
}

export const getBlogs = async (
  page: number,
  size: number,
): Promise<BlogResponse> => {
  try {
    const response = await requestWebRHCQS.get<BlogResponse>('/blogs', {
      params: { page, size },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const createBlog = async (
  blogData: CreateBlogRequest,
): Promise<void> => {
  try {
    const response = await requestWebRHCQS.post('/blogs', blogData, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (
  blogData: UpdateBlogRequest,
): Promise<void> => {
  try {
    const response = await requestWebRHCQS.put(
      `/blogs?blogId=${blogData.id}`,
      blogData,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const response = await requestWebRHCQS.delete(`/blogs?id=${id}`, {
      headers: {
        accept: '*/*',
      },
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};
