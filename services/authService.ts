import api from './api'; 


export const loginUser = async (name: string, surname: string, password: string) => {
  try {
    const res = await api.post('/Account/login', {
      name,
      surname,
      password,
    });

    return res.data;
  } catch (error: any) {
    // Log the entire error for debugging
    console.error('Login request failed:', error);

    // Log server response error if available
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }

    // Rethrow the error so it can be caught and used elsewhere (e.g., in the LoginScreen alert)
    throw error;
  }
};


export const registerUser = async (data: any) => {
  const res = await api.post('/Account/register', data);
  return res.data;
};