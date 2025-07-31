import api from './api';

export type Skater = {
  id: string;
  name: string;
  surname: string;
  categoryName: string;
};

export const getSkaters = async () => {
  const res = await api.get('/Skaters');
  return res.data; 
};


export const deleteSkater = async (id: string): Promise<void> =>
  await api.delete(`/Skaters/${id}`);

export const getSkaterCategories = async () => {
  const res = await api.get('/Category'); 
  return res.data;
};

export const createSkater = async (payload: {
  name: string;
  surname: string;
  categoryId: string;
}) => {
  return api.post('/Skaters', payload);
};

export const getSkaterById = async (id: string) => {
  const res = await api.get(`/Skaters/${id}`);
  return res.data;
};



export const updateSkater = async (
  id: string,
  data: { name: string; surname: string; categoryId: string }
) => {
  return api.put(`/Skaters/${id}`, data);
};

