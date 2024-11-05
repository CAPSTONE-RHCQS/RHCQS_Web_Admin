import axios from 'axios';
import { API_ROOT_V2 } from '../../utils/constants';

export const postLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_ROOT_V2}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
