import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface Profile {
  name: string;
  token_file: string;
  client_secret_file: string;
  video_folder: string;
  audio_folder: string;
  thumb_folder: string;
  output_folder: string;
  title_file: string;
  desc_file: string;
  num_audio: string;
  num_video: string;
  category: string;
  start_time: string;
  schedule_slots: string;
  monetization: boolean;
  auth_status?: string;
  auth_class?: string;
}

export interface FilesData {
  videos: string[];
  audios: string[];
  thumbs: string[];
}

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

// API functions
export const authApi = {
  login: (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  logout: () => api.get('/logout'),
};

export const profileApi = {
  getProfile: (profileName: string) => 
    api.get<Profile>(`/get_profile/${profileName}`),
  
  saveProfile: (data: Partial<Profile> & { profile_name: string }) => 
    api.post<ApiResponse>('/save_profile', data),
  
  addProfile: (formData: FormData) => 
    api.post<ApiResponse>('/add_profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteProfile: (profileName: string) => 
    api.post<ApiResponse>('/delete_profile', { profile_name: profileName }),
  
  startAuth: (profileName: string) => 
    api.get(`/auth/${profileName}`),
};

export const filesApi = {
  listFiles: (profileName: string) => 
    api.get<FilesData>(`/list_files/${profileName}`),
  
  uploadFile: (formData: FormData) => 
    api.post<ApiResponse>('/upload_file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteFile: (profileName: string, fileName: string, fileType: string) => 
    api.post<ApiResponse>('/delete_file', { 
      profile_name: profileName, 
      file_name: fileName, 
      file_type: fileType 
    }),
};

export const textApi = {
  getTextFile: (profileName: string, fileType: 'titles' | 'descriptions') => 
    api.get<{ content: string }>(`/get_text_file/${profileName}/${fileType}`),
  
  saveTextFile: (profileName: string, fileType: 'titles' | 'descriptions', content: string) => 
    api.post<ApiResponse>('/save_text_file', { 
      profile_name: profileName, 
      file_type: fileType, 
      content 
    }),
};