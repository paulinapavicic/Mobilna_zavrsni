import api from './api';

export const uploadMusicFile = async (programId: string, formData: FormData) => {
  return api.post(`/Music/program/${programId}/upload`, formData);
};


export const getMusicFilesByProgramId = async (programId: string) => {
  const res = await api.get(`/Music/program/${programId}`);
  return res.data; 
};
