import api from './api';

export const getEducationMaterials = async () => {
  const res = await api.get('/Education');
  return res.data;
};

export const deleteMaterial = async (id: string) => {
  await api.delete(`/Education/${id}`);
};


export const uploadEducationMaterial = async (data: { title: string; description: string }) => {
  return api.post('/Education', data); // adjust endpoint as needed
};



export const getMaterialDetails = async (id: string) => {
  const res = await api.get(`/Education/${id}`);
  return res.data;
};

export const deleteEducationFile = async (fileId: string) => {
  return api.delete(`/EducationalFile/${fileId}`);
};


export const deleteEducationMaterial = async (id: string) => {
  return api.delete(`/Education/${id}`);
};


export const uploadEducationalFile = (materialId: string, formData: FormData) => {
  return api.post(`/EducationalFile/material/${materialId}/upload`, formData);
};
