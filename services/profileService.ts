import api from './api';

export const getProfile = async () => {
  const res = await api.get('/Profile');
  return res.data;
};

export const updateProfile = async (data: { id: string, name: string, surname: string }) => {
  const res = await api.put('/Profile', data);
  return res.data;
};
