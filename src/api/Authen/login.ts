import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

export const postLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_ROOT}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
