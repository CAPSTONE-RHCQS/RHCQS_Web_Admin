import requestWebDriver from '../../utils/axios';
import { BlogResponse } from '../../types/BlogTypes';

interface CreateBlogRequest {
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
    const response = await requestWebDriver.get<BlogResponse>('/blogs', {
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

export const createBlog = async (blogData: CreateBlogRequest): Promise<void> => {
  try {
    const response = await requestWebDriver.post('/blogs', blogData, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
    });
    console.log('Blog created successfully:', response.data);
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};
