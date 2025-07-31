import api from './api';

export const uploadMusicFile = async (programId: string, formData: FormData) => {
  
  const url = `/Music/program/${programId}/upload`;
  return api.post(url, formData);
};


export const getMusicFilesByProgramId = async (programId: string) => {
  const res = await api.get(`/Music/program/${programId}`);
  return res.data; 
};
