import api from './api';

type CreateSkaterPayload = {
  name: string;
  surname: string;
  categoryId: number; // number type to match backend expectations
};


export const getSkaters = async () => {
  const res = await api.get('/Skaters');
  return res.data; 
};


export const deleteSkater = async (id: string) => {
  return api.delete(`/Skaters/${id}`);
};

export const getSkaterCategories = async () => {
  const res = await api.get('/Category'); 
  return res.data;
};

export const createSkater = async (payload: CreateSkaterPayload) => {
  return api.post('/Skaters', payload);
};

export const getSkaterById = async (id: string) => {
  const res = await api.get(`/Skaters/${id}`);
  return res.data;
};



export const updateSkater = async (
  id: string,
  data: { name: string; surname: string; categoryId: number }
) => {
  return api.put(`/Skaters/${id}`, data);
};
