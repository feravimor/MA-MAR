import { fetchData } from './api';

export const authenticate = async (email, password) => {
  try {
    const response = await fetchData('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};
