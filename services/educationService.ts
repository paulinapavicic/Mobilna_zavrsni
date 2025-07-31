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

/* If supporting file upload (multipart/form-data):
export const uploadEducationMaterial = async (formData: FormData) => {
  return api.post('/education', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
*/

export const getMaterialDetails = async (id: string) => {
  const res = await api.get(`/Education/${id}`);
  return res.data;
};

export const deleteEducationFile = async (fileId: string, materialId: string) => {
  return api.post(`/EducationalFile/delete`, { id: fileId, materialId });
};

export const deleteEducationMaterial = async (id: string) => {
  return api.delete(`/Education/${id}`);
};


export const uploadEducationalFile = async (formData: FormData) => {
  return api.post('/EducationalFile/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
