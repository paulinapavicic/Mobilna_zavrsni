// /services/utilsService.ts
import api from './api';

// Category type (adapt fields to your API response)
export type Category = {
  id: string;
  name: string;
};

// Coach type (adapt fields to your API response)
export type Coach = {
  id: string;
  name: string;
  surname: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get('/Category'); // Adjust endpoint if needed
  return res.data;
};

export const getCoaches = async (): Promise<Coach[]> => {
  const res = await api.get('/Coach'); // Adjust endpoint if needed
  return res.data;
};
