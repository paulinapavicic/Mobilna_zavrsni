import api from './api';

export const getTrainingElements = async (type: 'OnIce' | 'OffIce') => {
  const res = await api.get(`/Training/elements?type=${type}`);
  return res.data; 
};

export const createTraining = async (data: {
  date: string;
  duration: number;
  type: string;
  elements: string[];
  notes?: string;
}) => {
  return await api.post('/Training', data);
};

export const getTrainings = async () => {
  const res = await api.get('/Training');
  return res.data; 
};

export const getTrainingById = async (id: string) => {
  const res = await api.get(`/Training/${id}`);
  return res.data;
};

export const deleteTraining = async (id: string) => {
  return api.delete(`/Training/${id}`);
};



export const updateTraining = async (id: string, body: any) => {
  return await api.put(`/Training/${id}`, body);
};


