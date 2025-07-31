import api from './api';

export type Program = {
  id: string;
  year: number;
  type: 'Free' | 'Short';
  description: string;
};

export const getPrograms = async () => {
  const res = await api.get('/Program'); 
  return res.data;
};


export const deleteProgram = async (id: string) =>
  api.delete(`/Program/${id}`);

export const createProgram = async (program: {
  year: string;
  type: string;
  description: string;
}) => {
  return api.post('/Program', program);
};

export const getProgramById = async (id: string) => {
  const res = await api.get(`/Program/${id}`);
  return res.data;
};

export const getProgramDetails = async (id: string) => {
  const res = await api.get(`/Program/${id}/details`);
  return res.data;
};

export const addCommentToProgram = async (programId: string, comment: string) => {
  return await api.post(`/Program/${programId}/comments`, { comment });
};




export const updateProgram = async (
  id: string,
  data: { year: number; type: string; description: string }
) => {
  const res = await api.put(`/Program/${id}`, data);
  return res.data;
};
